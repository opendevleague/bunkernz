use std::net::TcpListener;
use std::thread::spawn;
use tungstenite::server::accept;

pub fn listen() {
    // A WebSocket echo server
    let server = TcpListener::bind("127.0.0.1:3000").unwrap();
    for stream in server.incoming() {
        spawn (move || {
            let mut websocket = accept(stream.unwrap()).unwrap();
            loop {
                let msg = websocket.read_message().unwrap();
                
                if !msg.is_binary() && !msg.is_text() {
                    continue;
                }
                
                let bytes = msg.into_data();
                println!("Received message length {}", bytes.len());
                
                let new_msg  = tungstenite::Message::Binary(vec![97,97,97,97,97]);
                websocket.write_message(new_msg).unwrap();
            }
        });
    }
}
