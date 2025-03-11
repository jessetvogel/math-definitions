use std::{
    collections::{HashMap, HashSet},
    fs::{File, OpenOptions},
    io::Write,
};

use crate::{
    lexer::{Lexer, Token, TokenKind},
    texsvg::TexSvg,
};

pub struct Parser {
    lexer: Option<Lexer>,
    current_token: Option<Token>,
    current_file: Option<File>,
    topics: HashMap<String, String>,
    examples: HashSet<String>,
    references: HashSet<(String, String)>,
    current_topic: String,
    current_prefix: String,
    target_directory: &'static str,
}

impl Parser {
    pub fn new(target_directory: &'static str) -> Self {
        Self {
            lexer: None,
            current_token: None,
            current_file: None,
            topics: HashMap::new(),
            examples: HashSet::new(),
            references: HashSet::new(),
            current_topic: String::new(),
            current_prefix: String::new(),
            target_directory,
        }
    }

    /// Returns a hashmap of all parsed topics.
    pub fn topics(&self) -> &HashMap<String, String> {
        &self.topics
    }

    /// Returns a hashset of all topics that have examples.
    pub fn examples(&self) -> &HashSet<String> {
        &self.examples
    }

    // Returns a hashset of all references between topics
    pub fn references(&self) -> &HashSet<(String, String)> {
        &self.references
    }

    pub fn parse(&mut self, prefix: &str, file: File) -> Result<(), ParserError> {
        self.lexer = Some(Lexer::new(file));
        self.current_prefix = prefix.to_owned();
        while !self.reached_end_of_file()? {
            self.skip_whitespace()?;
            self.parse_topic_or_example()?;
            self.skip_whitespace()?;
        }
        Ok(())
    }

    fn parse_topic_or_example(&mut self) -> Result<(), ParserError> {
        self.expect("\\begin")?;
        self.expect("{")?;
        match self.consume(&TokenKind::Text)?.as_str() {
            "topic" => self.parse_topic(),
            "example" => self.parse_example(),
            env => Err(ParserError::new(format!(
                "Expected 'topic' or 'example' environment, but found '{env:?}'"
            ))),
        }
    }

    fn parse_topic(&mut self) -> Result<(), ParserError> {
        self.expect("}")?;
        self.expect("{")?;
        let topic = self.consume(&TokenKind::Text)?;
        self.expect("}")?;
        self.expect("{")?;
        let name = escape_special_chars(self.consume(&TokenKind::Text)?);
        self.expect("}")?;

        let uid = self.uid(&topic);
        if self.topics.contains_key(&uid) {
            return Err(ParserError::new(format!("Identifier {uid} already used.")));
        }

        self.topics.insert(uid.clone(), name);
        self.current_topic = uid;

        self.open_topic_file(&topic)?;

        self.skip_whitespace()?;
        self.parse_environment("topic")?;
        self.close_file();

        Ok(())
    }

    fn parse_example(&mut self) -> Result<(), ParserError> {
        self.expect("}")?;
        self.expect("{")?;
        let topic = self.consume(&TokenKind::Text)?;
        self.expect("}")?;

        let uid = self.uid(&topic);
        if !self.topics.contains_key(&uid) {
            return Err(ParserError::new(format!(
                "Encountered example for non-existent topic {uid}"
            )));
        }

        self.open_example_file(&topic)?;

        self.write("<div class=\"example\">")?;
        self.skip_whitespace()?;
        self.parse_environment("example")?;
        self.write("</div>")?;
        self.current_file = None;

        self.examples.insert(uid);

        Ok(())
    }

    fn parse_begin_environment(&mut self) -> Result<(), ParserError> {
        self.expect("\\begin")?;
        self.expect("{")?;
        let env = self.consume(&TokenKind::Text)?;
        self.expect("}")?;
        // let args = [];
        while self.encounters_data("{")? {
            self.advance()?;
            self.consume(&TokenKind::Text)?;
            self.expect("}")?;
        }
        self.parse_environment(&env)
    }

    fn parse_environment(&mut self, env: &str) -> Result<(), ParserError> {
        match env {
            "enumerate" => {
                let item_type = if self.encounters_data("[")? {
                    self.advance()?;
                    self.expect("label")?;
                    self.expect("=")?;
                    let mut label = String::new();
                    while !self.encounters_data("]")?
                        && !self.encounters_kind(&TokenKind::Newline)?
                    {
                        label.push_str(&self.take()?);
                    }
                    self.expect("]")?;

                    match label.as_str() {
                        "(\\arabic*)" => "(1)",
                        "(\\roman*)" => "(i)",
                        "(\\Alph*)" => "(A)",
                        label => {
                            return Err(format!("Unsupported label '{label}' for enumerate").into())
                        }
                    }
                } else {
                    "(i)"
                };
                self.skip_whitespace()?;
                self.parse_list_environment(Some(&item_type))?;
            }
            "itemize" => {
                self.skip_whitespace()?;
                self.parse_list_environment(None)?;
            }
            "proof" => {
                self.skip_whitespace()?;
                self.write("<div class=\"proof\">")?;
                self.parse_content()?;
                self.write("</div>")?;
            }
            _ => {
                self.parse_content()?;
            }
        }

        self.skip_whitespace()?;

        self.expect("\\end")?;
        self.expect("{")?;
        self.expect(env)?;
        self.expect("}")
    }

    fn parse_list_environment(&mut self, item_type: Option<&str>) -> Result<(), ParserError> {
        match &item_type {
            None => self.write("<ul>")?,
            Some(item_type) => self.write(&format!("<ol type=\"{item_type}\">"))?,
        };

        let mut first = true;
        while self.encounters_data("\\item")? {
            self.advance()?;
            self.write(if first { "<li>" } else { "</li><li>" })?;
            first = false;
            self.parse_content()?;
        }
        if !first {
            self.write("</li>")?;
        }
        match &item_type {
            None => self.write("</ul>"),
            Some(_) => self.write("</ol>"),
        }
    }

    fn parse_content(&mut self) -> Result<(), ParserError> {
        loop {
            if self.encounters_kind(&TokenKind::Text)?
                || self.encounters_kind(&TokenKind::Whitespace)?
                || self.encounters_data("[")?
                || self.encounters_data("]")?
                || self.encounters_data("=")?
            {
                let data = escape_special_chars(self.take()?);
                self.write(&data)?;
                continue;
            }

            if self.encounters_kind(&TokenKind::Newline)? {
                self.advance()?;
                self.skip_whitespace_but_not_newlines()?;
                if self.encounters_kind(&TokenKind::Newline)? {
                    self.skip_whitespace()?;
                    self.write("<br>")?;
                }
                self.write("\n")?;
                continue;
            }

            if self.encounters_data("$")? {
                self.parse_inline_math()?;
                continue;
            }

            if self.encounters_data("\\[")? {
                self.parse_display_math()?;
                continue;
            }

            if self.encounters_data("\\textbf")? {
                self.parse_textbf()?;
                continue;
            }

            if self.encounters_data("\\textit")? {
                self.parse_textit()?;
                continue;
            }

            if self.encounters_data("\\texttt")? {
                self.parse_texttt()?;
                continue;
            }

            if self.encounters_data("\\emph")? {
                self.parse_emph()?;
                continue;
            }

            if self.encounters_data("\\tref")? {
                self.parse_tref()?;
                continue;
            }

            if self.encounters_data("\\img")? {
                self.parse_img()?;
                continue;
            }

            if self.encounters_data("\\begin")? {
                self.parse_begin_environment()?;
                continue;
            }

            break;
        }

        Ok(())
    }

    fn parse_inline_math(&mut self) -> Result<(), ParserError> {
        self.expect("$")?;
        self.write("<span class=\"math inline\">\\(")?;
        while !self.encounters_data("$")? {
            let data = self.take()?;
            self.write(&data)?;
        }
        self.expect("$")?;
        self.write("\\)</span>")
    }

    fn parse_display_math(&mut self) -> Result<(), ParserError> {
        self.expect("\\[")?;
        self.skip_whitespace()?;
        if self.encounters_data("\\svg")? {
            self.advance()?;
            let mut texsvg = TexSvg::new();
            while !self.encounters_data("\\]")? {
                texsvg.feed(&self.take()?)?;
            }
            self.expect("\\]")?;
            let filename = texsvg.compile(&format!("{}/svg", self.target_directory))?;
            self.write(&format!(
                "<div class=\"math display svg\"><img src=\"data/svg/{filename}\" alt /></div>"
            ))?;
        } else {
            self.write("<span class=\"math display\">\\[")?;
            while !self.encounters_data("\\]")? {
                let data = self.take()?;
                self.write(&data)?;
            }
            self.expect("\\]")?;
            self.write("\\]</span>")?;
        };
        Ok(())
    }

    fn parse_textbf(&mut self) -> Result<(), ParserError> {
        self.expect("\\textbf")?;
        self.expect("{")?;
        self.write("<b>")?;
        self.parse_content()?;
        self.expect("}")?;
        self.write("</b>")
    }

    fn parse_textit(&mut self) -> Result<(), ParserError> {
        self.expect("\\textit")?;
        self.expect("{")?;
        self.write("<i>")?;
        self.parse_content()?;
        self.expect("}")?;
        self.write("</i>")
    }

    fn parse_texttt(&mut self) -> Result<(), ParserError> {
        self.expect("\\texttt")?;
        self.expect("{")?;
        self.write("<span class=\"tt\">")?;
        self.parse_content()?;
        self.expect("}")?;
        self.write("</span>")
    }

    fn parse_emph(&mut self) -> Result<(), ParserError> {
        self.expect("\\emph")?;
        self.expect("{")?;
        self.write("<em>")?;
        self.parse_content()?;
        self.expect("}")?;
        self.write("</em>")
    }

    fn parse_tref(&mut self) -> Result<(), ParserError> {
        self.expect("\\tref")?;
        self.expect("{")?;
        let uid = self.parse_uid()?;
        self.expect("}")?;
        self.expect("{")?;
        self.write(&format!("<a href=\"#{uid}\">"))?;
        self.parse_content()?;
        self.expect("}")?;
        self.write("</a>")?;
        self.references.insert((self.current_topic.clone(), uid));
        Ok(())
    }

    fn parse_uid(&mut self) -> Result<String, ParserError> {
        let topic = self.consume(&TokenKind::Text)?;
        let uid = if topic.contains(':') {
            topic
        } else {
            format!("{}:{}", self.current_prefix, topic)
        };
        Ok(uid)
    }

    fn parse_img(&mut self) -> Result<(), ParserError> {
        self.expect("\\img")?;
        self.expect("{")?;
        let filename = self.consume(&TokenKind::Text)?;
        self.expect("}")?;
        self.write(&format!(
            "<img class=\"math-img\" src=\"data/img/{filename}\" alt />"
        ))
    }

    // parser util

    fn open_topic_file(&mut self, topic: &str) -> Result<(), ParserError> {
        let path = format!(
            "{}/topics/{}-{}.html",
            self.target_directory, self.current_prefix, topic
        );
        let file = match File::create(&path) {
            Ok(file) => file,
            Err(err) => {
                return Err(format!("Could not open file '{path}' for writing: {err}").into())
            }
        };
        self.current_file = Some(file);
        Ok(())
    }

    fn open_example_file(&mut self, topic: &str) -> Result<(), ParserError> {
        let uid = self.uid(topic);
        let path = format!(
            "{}/examples/{}-{}.html",
            self.target_directory, self.current_prefix, topic
        );
        let append = self.examples.contains(&uid);
        let file = match OpenOptions::new()
            .write(true)
            .append(append)
            .create(!append)
            .truncate(!append)
            .open(&path)
        {
            Ok(file) => file,
            Err(err) => {
                return Err(format!("Could not open file '{path}' for writing: {err}").into())
            }
        };
        self.current_file = Some(file);
        Ok(())
    }

    fn close_file(&mut self) {
        self.current_file = None;
    }

    fn write(&self, s: &str) -> Result<(), ParserError> {
        self.current_file.as_ref().unwrap().write(s.as_bytes())?;
        Ok(())
    }

    fn skip_whitespace(&mut self) -> Result<(), ParserError> {
        while self.encounters_kind(&TokenKind::Whitespace)?
            || self.encounters_kind(&TokenKind::Newline)?
        {
            self.advance()?;
        }
        Ok(())
    }

    fn skip_whitespace_but_not_newlines(&mut self) -> Result<(), ParserError> {
        while self.encounters_kind(&TokenKind::Whitespace)? {
            self.advance()?;
        }
        Ok(())
    }

    /// Expect a token kind with data. Results in an error when it does not match.
    fn expect(&mut self, data: &str) -> Result<(), ParserError> {
        if self.current_token.is_none() {
            self.advance()?;
        }
        match &self.current_token.take() {
            None => Err(format!("Expected token '{data}' but reached end of file").into()),
            Some(token) => {
                if token.data != data {
                    Err(format!(
                        "Expected token '{data}' but received '{}', at line {} position {}",
                        token.data, token.line, token.position
                    )
                    .into())
                } else {
                    Ok(())
                }
            }
        }
    }

    /// Take a token of given kind. If the kind does not match, result in an error.
    fn consume(&mut self, kind: &TokenKind) -> Result<String, ParserError> {
        if self.current_token.is_none() {
            self.advance()?;
        }
        match self.current_token.take() {
            None => {
                Err(format!("Expected token of kind '{kind:?}' but reached end of file").into())
            }
            Some(token) => {
                if token.kind != *kind {
                    Err(format!(
                        "Expected token of kind '{kind:?}' but received token of kind '{:?}', at line {} position {}",
                        token.kind, token.line, token.position
                    )
                    .into())
                } else {
                    Ok(token.data)
                }
            }
        }
    }

    fn encounters_data(&mut self, data: &str) -> Result<bool, ParserError> {
        if self.current_token.is_none() {
            self.advance()?;
        }
        match &self.current_token {
            None => Ok(false),
            Some(token) => Ok(token.data == data),
        }
    }

    fn encounters_kind(&mut self, kind: &TokenKind) -> Result<bool, ParserError> {
        if self.current_token.is_none() {
            self.advance()?;
        }
        match &self.current_token {
            None => Ok(false),
            Some(token) => Ok(token.kind == *kind),
        }
    }

    /// Go to the next token.
    fn advance(&mut self) -> Result<(), ParserError> {
        self.current_token = match &mut self.lexer {
            Some(lexer) => lexer.next_token()?,
            None => panic!(""),
        };
        Ok(())
    }

    /// Get the current token.
    fn take(&mut self) -> Result<String, ParserError> {
        if self.current_token.is_none() {
            self.advance()?;
        }
        match self.current_token.take() {
            None => Err("Unexpected end of file".to_owned().into()),
            Some(token) => Ok(token.data),
        }
    }

    fn reached_end_of_file(&mut self) -> Result<bool, ParserError> {
        if self.current_token.is_none() {
            self.advance()?;
        }
        Ok(self.current_token.is_none())
    }

    fn uid(&self, topic: &str) -> String {
        format!("{}:{}", self.current_prefix, topic)
    }
}

pub struct ParserError {
    pub message: String,
}

impl ParserError {
    pub fn new(message: String) -> Self {
        Self { message }
    }
}

impl From<std::io::Error> for ParserError {
    fn from(value: std::io::Error) -> Self {
        Self {
            message: value.to_string(),
        }
    }
}

impl From<String> for ParserError {
    fn from(value: String) -> Self {
        Self {
            message: format!("{value}"),
        }
    }
}

fn escape_special_chars(mut s: String) -> String {
    s = s.replace('`', "‘");
    s = s.replace('\'', "’");
    s = s.replace("``", "“");
    s = s.replace('"', "”");
    s = s.replace("\'\'", "”");
    s = s.replace("--", "–");
    return s;
}
