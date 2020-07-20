use std::{
    str,
    ffi::{CString, CStr}
};
use std::sync::Mutex;
use oxid::*;

pub static mut BUFFER_BYTES: [u8; 1_000] = [0; 1_000];
static mut WEBSOCKET: Option<WebSocket> = None;

pub struct WebSocket(pub Box<dyn FnMut(&[u8])>);

impl WebSocket {
    pub fn init(callback: Box<dyn FnMut(&[u8])>) {
        let ws = WebSocket(callback);
        
        unsafe {
            WEBSOCKET = Some(ws);
        };
    }
    
    pub fn send_bytes(data: &[u8]) {
        unsafe {
            let length = data.len();
            let memory = &mut BUFFER_BYTES;
            memory[..length].clone_from_slice(&data[..length]);
            ws_send(memory.as_ptr(), data.len() as u32);
        }
    }

    pub fn send_string(data: &str) {
        WebSocket::send_bytes(data.as_bytes());
    }
    
    pub fn on_message(data: &[u8]) {
        if let Some(ws) = unsafe { &mut WEBSOCKET } {
            ws.0(data);
        }
    }
}

#[no_mangle]
pub extern "C" fn ws_receive(length: *const u8) {
    let length = length as usize;

    let data: &[u8] = unsafe { 
        &BUFFER_BYTES[0..length]
    };
    
    WebSocket::on_message(data);
    
    // for i in 0..length {
    //     unsafe {
    //         info!("buffer[{}]: {}", i, BUFFER_BYTES[i]);
    //     }
    // }
}

#[no_mangle]
extern "C" {
    pub fn ws_send(data: *const u8, length: u32);
}