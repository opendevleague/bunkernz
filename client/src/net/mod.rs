mod wasm;

use std::sync::Mutex;
use oxid::*;

pub struct WebSocket;

impl WebSocket {
    pub fn send_bytes(data: &[u8]) {
        unsafe {
            let length = data.len();
            let memory = &mut wasm::BUFFER_BYTES;
            memory[..length].clone_from_slice(&data[..length]);
            wasm::ws_send(memory.as_ptr(), data.len() as u32);
        }
    }

    pub fn send_string(data: &str) {
        WebSocket::send_bytes(data.as_bytes());
    }
}