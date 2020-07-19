use std::net::TcpListener;
use std::thread::spawn;
use tungstenite::server::accept;
use std::ffi::CString;
use std::{
    slice,
    str,
};

pub fn listen() {
    /// A WebSocket echo server
    let server = TcpListener::bind("127.0.0.1:3000").unwrap();
    for stream in server.incoming() {
        spawn (move || {
            let mut websocket = accept(stream.unwrap()).unwrap();
            loop {
                let msg = websocket.read_message().unwrap();
                
                if !msg.is_binary() && !msg.is_text() {
                    continue;
                }
                
                println!("Received message {}", msg.to_text().unwrap());
                websocket.write_message(msg).unwrap();
            }
        });
    }
}