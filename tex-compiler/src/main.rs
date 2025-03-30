use std::{
    fs::{self, create_dir_all, File},
    io::{Result, Write},
    path::PathBuf,
};

use colored::Colorize;
use parser::Parser;

mod lexer;
mod parser;
mod texsvg;

const SOURCE_DIRECTORY: &str = "../tex";
const TARGET_DIRECTORY: &str = "../public/data";
const TOPICS_JS: &str = "../public/data/topics.js";
const EXAMPLES_JS: &str = "../public/data/examples.js";
const CATEGORIES: &[(&str, &str)] = &[
    ("AA", "Algebra"),
    ("AG", "Algebraic Geometry"),
    ("AT", "Algebraic Topology"),
    ("CA", "Complex Analysis"),
    ("CO", "Combinatorics"),
    ("CP", "Computer Algebra"),
    ("CT", "Category Theory"),
    ("DG", "Differential Geometry"),
    ("DT", "Deformation Theory"),
    ("FA", "Functional Analysis"),
    ("GM", "General"),
    ("GT", "Group Theory"),
    ("HA", "Homological Algebra"),
    ("HT", "Homotopy Theory"),
    ("LA", "Linear Algebra"),
    ("LO", "Logic"),
    ("MT", "Measure Theory"),
    ("NT", "Number Theory"),
    ("OR", "Operations Research"),
    ("PT", "Probability Theory"),
    ("RT", "Representation Theory"),
    ("ST", "Set Theory"),
    ("TO", "Topology"),
    ("UN", "Uncategorized"),
];

fn main() {
    // Step 0: Make sure TARGET_DIRECTORY exists, and `topics`, `examples`, `svg` subdirectories
    for path in &[
        TARGET_DIRECTORY,
        &format!("{TARGET_DIRECTORY}/topics"),
        &format!("{TARGET_DIRECTORY}/examples"),
        &format!("{TARGET_DIRECTORY}/svg"),
    ] {
        if let Err(err) = create_dir_all(path) {
            println!(
                "{}: Failed to create target directory '{path}' ({err})",
                "Error".red()
            );
            std::process::exit(1);
        }
    }

    // Step 1: Find all .tex files
    let tex_files = find_tex_files();
    println!(
        "Found {} .tex files in {}",
        tex_files.len(),
        SOURCE_DIRECTORY
    );

    // Step 2: Parse all .tex files
    let mut parser = Parser::new(TARGET_DIRECTORY);
    for (prefix, path) in &tex_files {
        // Open file
        let file = match File::open(path) {
            Err(err) => {
                println!("{}: Failed to open file '{path:?}' ({err})", "Error".red());
                std::process::exit(1);
            }
            Ok(file) => file,
        };
        // Parse file
        print!("Parsing {} .. ", path.to_str().unwrap());
        std::io::stdout().flush().unwrap();
        match parser.parse(prefix, file) {
            Ok(()) => {
                println!("{}", "ok".green());
            }
            Err(error) => {
                println!("{}", "failed".red());
                println!("\n{}: {}", "Error".red(), error.message);
                std::process::exit(1);
            }
        }
    }

    // Step 3: Check if all referenced topics exist
    let topics = parser.topics();
    for (uid_from, uid_to) in parser.references() {
        if !topics.contains_key(uid_to) {
            println!(
                "\n{}: Topic '{uid_from}' contains reference to non-existent topic '{uid_to}'",
                "Error".red()
            );
            std::process::exit(1);
        }
    }

    // Step 4: Write `topics.js`
    match write_topics_js(&parser) {
        Ok(()) => {}
        Err(err) => {
            println!(
                "{}: Failed to write to '{}' ({err})",
                "Error".red(),
                TOPICS_JS
            );
            std::process::exit(1);
        }
    }

    // Step 5: Write `examples.js`
    match write_examples_js(&parser) {
        Ok(()) => {}
        Err(err) => {
            println!(
                "{}: Failed to write to '{}' ({err})",
                "Error".red(),
                TOPICS_JS
            );
            std::process::exit(1);
        }
    }

    // Done
    println!("\nDone! 🎉 ({} topics)", parser.topics().len());
}

fn find_tex_files() -> Vec<(&'static str, PathBuf)> {
    let mut tex_files = Vec::new();
    for &(prefix, category) in CATEGORIES {
        let path = format!("{SOURCE_DIRECTORY}/{category}");
        let entries = match fs::read_dir(&path) {
            Ok(entries) => entries,
            Err(err) => {
                println!(
                    "{}: Failed to read directory '{}' ({err})",
                    "Error".red(),
                    path,
                );
                std::process::exit(1);
            }
        };
        for entry in entries {
            let entry = entry.unwrap();
            if entry.file_type().unwrap().is_file()
                && entry
                    .file_name()
                    .to_str()
                    .map_or(false, |s| s.ends_with(".tex") && !s.starts_with("--"))
            {
                tex_files.push((prefix, entry.path()));
            }
        }
    }
    tex_files
}

fn write_topics_js(parser: &Parser) -> Result<()> {
    let mut topics_js = File::create(TOPICS_JS)?;
    topics_js.write(b"const topics = {\n")?;
    for (uid, name) in parser.topics() {
        topics_js.write(format!("  \"{}\": \"{}\",\n", uid, name).as_bytes())?;
    }
    topics_js.write(b"}")?;
    Ok(())
}

fn write_examples_js(parser: &Parser) -> Result<()> {
    let mut examples_js = File::create(EXAMPLES_JS)?;
    examples_js.write(b"const examples = [\n")?;
    for uid in parser.examples() {
        examples_js.write(format!("  \"{}\",\n", uid).as_bytes())?;
    }
    examples_js.write(b"]")?;
    Ok(())
}
