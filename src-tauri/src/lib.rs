use std::process::Command;

// Try to find ollama binary in common locations
fn get_ollama_path() -> Option<String> {
    let paths = [
        "ollama",
        "/usr/local/bin/ollama",
        "/opt/homebrew/bin/ollama",
    ];
    
    for path in paths {
        if Command::new(path)
            .arg("--version")
            .output()
            .map(|o| o.status.success())
            .unwrap_or(false)
        {
            return Some(path.to_string());
        }
    }
    None
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn check_ollama_installed() -> bool {
    get_ollama_path().is_some()
}

#[tauri::command]
fn run_ollama_command(args: Vec<String>) -> String {
    if let Some(ollama_path) = get_ollama_path() {
        let output = Command::new(&ollama_path)
            .args(args)
            .output();
            
        match output {
            Ok(o) => {
                if o.status.success() {
                    String::from_utf8_lossy(&o.stdout).to_string()
                } else {
                    let stderr = String::from_utf8_lossy(&o.stderr);
                    format!("Error: {}", stderr)
                }
            },
            Err(e) => format!("Error: {}", e),
        }
    } else {
        "Error: Ollama not found".to_string()
    }
}

#[tauri::command]
fn install_ollama() -> bool {
    let _ = opener::open("https://ollama.com/download");
    true
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet, 
            check_ollama_installed, 
            run_ollama_command,
            install_ollama
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

