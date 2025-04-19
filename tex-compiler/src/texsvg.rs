const START_TEX_FILE: &str = r"
\documentclass{standalone}

\usepackage{amsmath}
\usepackage{amsfonts}
\usepackage{amssymb}
% \usepackage{tikz-cd} \usetikzlibrary{decorations.pathmorphing}
% \usepackage{quantikz}
\usepackage{stmaryrd}

\newcommand{\NN}{\mathbb{N}}
\newcommand{\ZZ}{\mathbb{Z}}
\newcommand{\QQ}{\mathbb{Q}}
\newcommand{\RR}{\mathbb{R}}
\newcommand{\CC}{\mathbb{C}}
\newcommand{\PP}{\mathbb{P}}
\renewcommand{\AA}{\mathbb{A}}
\newcommand{\id}{\textup{id}}
\newcommand{\bdot}{\bullet}
\newcommand{\isom}{\cong}
\DeclareMathOperator{\Spec}{Spec}
\DeclareMathOperator{\coker}{coker}
\DeclareMathOperator{\Hom}{Hom}
\DeclareMathOperator{\iHom}{\underline{Hom}}

\begin{document} $ \displaystyle 
";

// These are the positions of the '%' characters of the `tikz-cd` and `quantikz` packages.
// Since these are not compatible, we have to 'uncomment' those lines if necessary.
// However, we only know this after reading all the TeX code to compile.
const POSITION_USEPACKAGE_TIKZCD: u64 = 93;
const POSITION_USEPACKAGE_QUANTIKZ: u64 = 158;

const END_TEX_FILE: &str = r"
 $ \end{document}
";

const TMP_DIRECTORY: &str = "tmp";

use std::{
    fs::{self, File},
    hash::{DefaultHasher, Hasher},
    io::{Seek, SeekFrom, Write},
    path::Path,
    process::Command,
};

use colored::Colorize;

pub struct TexSvg {
    file: File,
    hasher: DefaultHasher,
    use_tikzcd: bool,
    use_quantikz: bool,
}

impl TexSvg {
    pub fn new() -> Self {
        // Create temporary file for writing in temporary directory
        fs::create_dir_all(TMP_DIRECTORY).unwrap();
        let mut file = File::create(&format!("{TMP_DIRECTORY}/tmp.tex")).unwrap();

        // Write start of tex document to file
        file.write(START_TEX_FILE.as_bytes()).unwrap();

        Self {
            file,
            hasher: DefaultHasher::new(),
            use_tikzcd: false,
            use_quantikz: false,
        }
    }

    pub fn feed(&mut self, data: &str) -> std::io::Result<()> {
        // Write data to file
        self.file.write(data.as_bytes())?;

        // Feed trimmed data to hasher (so that changing whitespace does not change hash)
        self.hasher.write(data.trim().as_bytes());

        // Check for packages
        self.use_tikzcd |= data == "tikzcd";
        self.use_tikzcd |= data == "tikzpicture";
        self.use_quantikz |= data == "quantikz";

        Ok(())
    }

    pub fn compile(mut self, target_directory: &str) -> Result<String, String> {
        // Write end of tex document to file
        self.file
            .write(END_TEX_FILE.as_bytes())
            .or(Err("Failed to write to file"))?;

        // Use packages if flags are set
        if self.use_tikzcd {
            self.file
                .seek(SeekFrom::Start(POSITION_USEPACKAGE_TIKZCD))
                .or(Err("Failed to seek"))?;
            self.file.write(&[b' ']).or(Err("Failed to write"))?; // Overwrite '%' with ' '
        }
        if self.use_quantikz {
            self.file
                .seek(SeekFrom::Start(POSITION_USEPACKAGE_QUANTIKZ))
                .or(Err("Failed to seek"))?;
            self.file.write(&[b' ']).or(Err("Failed to write"))?; // Overwrite '%' with ' '
        }

        // Compute svg path from hash
        let hash = self.hasher.finish();
        let filename_svg = format!("{hash}.svg");
        let path_to_svg = format!("{target_directory}/{filename_svg}");

        // Close file by dropping self
        drop(self);

        // Compile to svg only if svg does not yet exist
        // Do not fail on failed `pdflatex` or `pdf2svg` (only show warnings)
        if !Path::new(&path_to_svg).exists() {
            if let Err(err) = TexSvg::pdflatex() {
                println!("\n{}: {err}", "Warning".yellow());
            } else {
                if let Err(err) = TexSvg::pdf2svg(&path_to_svg) {
                    println!("\n{}: {err}", "Warning".yellow());
                }
            }
        }

        // Delete temporary directory
        fs::remove_dir_all(TMP_DIRECTORY).unwrap();

        Ok(filename_svg)
    }

    fn pdflatex() -> Result<(), String> {
        match Command::new("pdflatex")
            .args([
                "-halt-on-error",
                "-interaction=nonstopmode",
                &format!("-output-directory={TMP_DIRECTORY}"),
                &format!("{TMP_DIRECTORY}/tmp.tex"),
            ])
            .output()
        {
            Ok(output) => {
                if output.status.code() != Some(0) {
                    println!("{}", String::from_utf8(output.stdout).unwrap());
                    return Err("Failed to run `pdflatex`".to_owned());
                } else {
                    Ok(())
                }
            }
            Err(err) => Err(format!("Failed to run `pdflatex` ({})", err.to_string())),
        }
    }

    fn pdf2svg(path_to_svg: &str) -> Result<(), String> {
        match Command::new("pdf2svg")
            .args([&format!("{TMP_DIRECTORY}/tmp.pdf"), path_to_svg])
            .output()
        {
            Ok(output) => {
                if output.status.code() != Some(0) {
                    Err("Failed to run `pdf2svg`".into())
                } else {
                    Ok(())
                }
            }
            Err(err) => Err(format!("Failed to run `pdf2svg` ({})", err.to_string())),
        }
    }
}
