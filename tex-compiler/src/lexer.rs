use std::{
    fs::File,
    io::{BufRead, BufReader, Result},
};

const SEPARATORS: &[&str] = &[
    "{", "}", "\\[", "\\]", "$", "\\&", "\\#", "\\\\", "\\{", "\\}", "\\;", "\\,", "\\ ", "\\!",
    "[", "]", "\\|", "=", "&",
];

#[derive(Debug, PartialEq)]
pub enum TokenKind {
    Text,
    Command,
    Separator,
    Whitespace,
    Newline,
}

#[derive(Debug)]
pub struct Token {
    pub kind: TokenKind,
    pub line: usize,
    pub position: usize,
    pub data: String,
}

impl Token {
    fn new(kind: TokenKind, line: usize, position: usize, data: String) -> Self {
        Self {
            kind,
            line,
            position,
            data,
        }
    }
}

pub struct Lexer {
    reader: BufReader<File>,
    buffer: String,
    char_indices: Vec<usize>,
    line: usize,
    token_start: usize,
    token_end: usize,
}

impl Lexer {
    pub fn new(file: File) -> Self {
        Self {
            reader: BufReader::new(file),
            buffer: String::new(),
            char_indices: Vec::new(),
            line: 0,
            token_start: 0,
            token_end: 0,
        }
    }

    pub fn next_token(&mut self) -> Result<Option<Token>> {
        // when at end of line, read new line
        if self.token_start + 1 >= self.char_indices.len() && !self.read_line()? {
            return Ok(None);
        }

        // when encountering comment start, ignore rest of the line
        if self.selection() == "%" {
            if !self.read_line()? {
                return Ok(None);
            }
            return self.next_token();
        }

        loop {
            if self.token_end + 1 >= self.char_indices.len() {
                break;
            }
            self.token_end += 1; // try increasing selection
            if !self.is_token(self.selection()) {
                self.token_end -= 1; // undo increasing selection
                break;
            }
        }

        // Construct token from string view
        let token = self.to_token(self.selection());

        // Update `token_start` and `token_end`
        self.token_start = self.token_end;
        self.token_end = self.token_start + 1;

        Ok(Some(token))
    }

    fn read_line(&mut self) -> Result<bool> {
        self.buffer.clear();
        self.char_indices.clear();

        // length of line is zero means no more lines
        if self.reader.read_line(&mut self.buffer)? == 0 {
            return Ok(false);
        }

        self.char_indices
            .extend(self.buffer.char_indices().map(|(i, _)| i));
        self.char_indices.push(self.buffer.len());

        self.line += 1;
        self.token_start = 0;
        self.token_end = 1;

        Ok(true)
    }

    fn selection(&self) -> &str {
        let i = self.char_indices[self.token_start];
        let j = self.char_indices[self.token_end];
        &self.buffer[i..j]
    }

    fn is_separator(expr: &str) -> bool {
        SEPARATORS.contains(&expr)
    }

    fn is_command(expr: &str) -> bool {
        let mut chars = expr.chars();
        chars.next() == Some('\\') && chars.all(|c| c.is_ascii_alphabetic())
    }

    fn is_text(expr: &str) -> bool {
        let excluded = &['{', '}', '\\', '[', ']', '$', '=', '\t', '\n', '&', '%'];
        expr.chars().nth(0) != Some(' ') && expr.chars().all(|c| !excluded.contains(&c))
    }

    fn is_newline(expr: &str) -> bool {
        expr == "\n"
    }

    fn is_whitespace(expr: &str) -> bool {
        expr.chars().all(|c| c == ' ' || c == '\t')
    }

    fn is_token(&self, expr: &str) -> bool {
        Lexer::is_separator(expr)
            || Lexer::is_command(expr)
            || Lexer::is_text(expr)
            || Lexer::is_newline(expr)
            || Lexer::is_whitespace(expr)
    }

    fn to_token(&self, expr: &str) -> Token {
        if Lexer::is_separator(expr) {
            return self.create_token(TokenKind::Separator, expr.to_owned());
        }
        if Lexer::is_newline(expr) {
            return self.create_token(TokenKind::Newline, expr.to_owned());
        }
        if Lexer::is_whitespace(expr) {
            return self.create_token(TokenKind::Whitespace, expr.to_owned());
        }
        if Lexer::is_command(expr) {
            return self.create_token(TokenKind::Command, expr.to_owned());
        }
        if Lexer::is_text(expr) {
            return self.create_token(TokenKind::Text, expr.to_owned());
        }
        panic!("Function `to_token` called with invalid expression");
    }

    fn create_token(&self, kind: TokenKind, data: String) -> Token {
        let position = self.char_indices[self.token_start];
        Token::new(kind, self.line, position, data)
    }
}
