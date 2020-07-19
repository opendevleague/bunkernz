use std::ffi::{CString, CStr};
use oxid::*;
use std::str;

// Incoming

#[no_mangle]
pub extern "C" fn ws_receive(bytes: *mut u8, length: usize) {
    let slice = unsafe {
        std::slice::from_raw_parts(bytes, length)
    };
    
    for i in 0..length {
        info!("bytes[{}]: {}", i, slice[i]);
    }

    let msg = unsafe {
        String::from_raw_parts(bytes, length, length)
    };
    
    info!("Message: {}", msg);
}

// Outgoing

#[no_mangle]
extern "C" {
    fn ws_send(data: *const u8);
}

pub fn ws_send_str(data: &str) {
    unsafe {
        ws_send(&data.as_bytes()[0]);
    }
}