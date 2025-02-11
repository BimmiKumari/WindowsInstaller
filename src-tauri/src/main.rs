// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use std::fs;
use std::path::Path;
use reqwest::blocking::get;
use std::io::Write;

// ... existing code ...

// ... existing code ...

#[tauri::command]
fn install_selected_tools(selected_tools: Vec<String>, install_path: String) -> Result<(), String> {
    let path = Path::new(&install_path);
    
    if !path.exists() {
        fs::create_dir_all(&path).map_err(|e| e.to_string())?;
    }

    for tool in selected_tools.iter() {
        match tool.as_str() {
            "gingerauth" => run_install_script("ginger-society/ginger-auth:latest", path)?,
            "gingerConnector" => run_install_script("ginger-society/ginger-connector:latest", path)?,
            "gingerScaffolder" => run_install_script("ginger-society/ginger-scaffolder:latest", path)?,
            "gingerReleaser" => run_install_script("ginger-society/ginger-releaser:latest", path)?,
            "gingerDB" => run_install_script("ginger-society/ginger-db:latest", path)?,
            unknown => return Err(format!("Unknown tool: {}", unknown)),
        }
    }

    Ok(())
}

fn run_install_script(tool: &str, install_path: &Path) -> Result<(), String> {
    #[cfg(target_family = "unix")]
    let (shell, shell_arg) = ("sh", "-c");
    #[cfg(target_family = "windows")]
    let (shell, shell_arg) = ("cmd", "/C");

    let script = format!(
        "bash -c \"$(curl -fsSL https://raw.githubusercontent.com/ginger-society/infra-as-code-repo/main/rust-helpers/installer.sh)\" -- {} {}",
        tool,
        install_path.to_str().ok_or("Invalid install path")?
    );

    println!("Installing {tool} to {}", install_path.display());
    
    let output = Command::new(shell)
        .arg(shell_arg)
        .arg(&script)
        .output()
        .map_err(|e| format!("Failed to execute install command: {}", e))?;

    if !output.status.success() {
        let error = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Failed to install {}: {}", tool, error));
    }

    println!("Successfully installed {tool}");
    Ok(())
}

fn download_and_install(url: &str, install_path: &Path) -> Result<(), String> {
    println!("Downloading from {url}");
    
    let filename = url.split('/').last()
        .ok_or("Invalid URL format")?;
    let file_path = install_path.join(filename);

    let mut response = get(url)
        .map_err(|e| format!("Failed to download file: {}", e))?;
    let mut file = fs::File::create(&file_path)
        .map_err(|e| format!("Failed to create file: {}", e))?;
    
    response.copy_to(&mut file)
        .map_err(|e| format!("Failed to write file: {}", e))?;

    println!("Downloaded to {}", file_path.display());

    #[cfg(target_os = "windows")]
    {
        Command::new("cmd")
            .args(["/C", file_path.to_str().ok_or("Invalid file path")?])
            .output()
            .map_err(|e| format!("Failed to execute installer: {}", e))?;
    }

    #[cfg(target_family = "unix")]
    {
        Command::new("chmod")
            .arg("+x")
            .arg(file_path.to_str().ok_or("Invalid file path")?)
            .status()
            .map_err(|e| format!("Failed to set executable permissions: {}", e))?;

        Command::new(file_path.to_str().ok_or("Invalid file path")?)
            .output()
            .map_err(|e| format!("Failed to execute installer: {}", e))?;
    }

    println!("Installation completed successfully");
    Ok(())
}

// ... existing code ...

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![install_selected_tools])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}

