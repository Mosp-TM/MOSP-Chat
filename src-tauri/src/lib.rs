use std::process::Command;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn check_ollama_installed() -> bool {
    // Simply try to run 'ollama list' - this works if Ollama is installed and running
    Command::new("ollama")
        .arg("list")
        .output()
        .map(|output| output.status.success())
        .unwrap_or(false)
}

#[tauri::command]
fn run_ollama_command(args: Vec<String>) -> String {
    let output = Command::new("ollama")
        .args(args)
        .output();
        
    match output {
        Ok(o) => String::from_utf8_lossy(&o.stdout).to_string(),
        Err(e) => format!("Error: {}", e),
    }
}

#[tauri::command]
fn install_ollama() -> bool {
    // For now, we'll just open the download page as running 
    // interactive installers in background is complex
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
