use std::process::{Command, Stdio};

fn run_shell_command(program: &str, args: &[&str]) -> Result<(), String> {
    println!("👉 Running: {} {}", program, args.join(" "));

    let status = Command::new(program)
        .args(args)
        .stdin(Stdio::inherit())
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .status()
        .map_err(|e| format!("Failed to start command: {e}"))?;

    if !status.success() {
        return Err(format!("Command failed with exit code: {:?}", status.code()));
    }

    Ok(())
}

fn main() {
    let os = std::env::consts::OS;
    println!("✅ Detected OS: {}", os);

    let result = match os {
        // ---------- Windows ----------
        "windows" => {
            // Install Ollama via winget
            run_shell_command("cmd", &["/C", "winget install -e --id Ollama.Ollama"])
                .and_then(|_| run_shell_command("cmd", &["/C", "ollama pull deepseek-r1:1.5b"]))
                .and_then(|_| run_shell_command("cmd", &["/C", "ollama list"]))
        }

        // ---------- macOS ----------
        "macos" => {
            // Install via curl script
            run_shell_command(
                "sh",
                &[
                    "-c",
                    "curl -fsSL https://ollama.com/install.sh | sh && ollama pull deepseek-r1:1.5b && ollama list",
                ],
            )
        }

        // ---------- Linux ----------
        "linux" => {
            // Install via curl script
            run_shell_command(
                "sh",
                &[
                    "-c",
                    "curl -fsSL https://ollama.com/install.sh | sh && ollama pull deepseek-r1:1.5b && ollama list",
                ],
            )
        }

        // ---------- Unsupported ----------
        other => Err(format!("❌ Unsupported OS: {other}")),
    };

    if let Err(e) = result {
        eprintln!("❌ Error: {e}");
        std::process::exit(1);
    }

    println!("🎉 Done! Ollama installed, model pulled, and models listed.");
}
