use std::{
    str,
    ffi::{CString, CStr}
};
use oxid::*;

pub static mut BUFFER_BYTES: [u8; 1_000] = [0; 1_000];

#[no_mangle]
pub extern "C" fn ws_receive(length: *const u8) {
    let length = length as usize;
    
    for i in 0..length {
        unsafe {
            info!("buffer[{}]: {}", i, BUFFER_BYTES[i]);
        }
    }
}

#[no_mangle]
extern "C" {
    pub fn ws_send(data: *const u8, length: u32);
}