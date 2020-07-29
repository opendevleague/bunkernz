use std::{
    str,
    ffi::{CString, CStr}
};
use std::sync::Mutex;
use oxid::*;
use crate::systems::packets::new;

pub static mut IS_OPEN: bool = false;
pub static mut OUTGOING_STREAM: [u8; 10_000] = [0; 10_000];
pub static mut INCOMING_STREAM: [u8; 10_000] = [0; 10_000];
pub static mut INCOMING_QUEUE: [u8; 10_000] = [0; 10_000];

pub fn is_open() -> bool {
    unsafe {
        IS_OPEN
    }
}

pub fn read_stream() -> &'static [u8] {
    let mut length: u16 = 0;
    
    unsafe {
        length = ((INCOMING_QUEUE[0] as u16) << 8) | INCOMING_QUEUE[1] as u16;
        &INCOMING_QUEUE[2..(length as usize)+2]
    }
}


pub fn initialise() {
    unsafe {
        // Send INCOMING_STREAM pointer to JS.
        ws_initialise(INCOMING_STREAM.as_ptr());
    }
}

pub fn send_bytes(data: &[u8]) {
    unsafe {
        let length = data.len();
        OUTGOING_STREAM[..length].clone_from_slice(&data[..length]);
        ws_send(
            OUTGOING_STREAM.as_ptr(),
            data.len() as u32
        );
    }
}

pub fn send_string(data: &str) {
    unsafe {
        send_bytes(data.as_bytes());
    }
}

#[no_mangle]
pub extern "C" fn ws_on_receive(length: *const u8) {
    let length = length as usize;

    let data: &[u8] = unsafe {
        &INCOMING_STREAM[0..length]
    };

    info!("Received, length: {}", length);

    unsafe {
        let prev_length = ((INCOMING_QUEUE[0] as u16) << 8) | INCOMING_QUEUE[1] as u16;
        let curr_length: u16 = prev_length + data.len() as u16;
        let bytes: [u8; 2] = curr_length.to_be_bytes();
        INCOMING_QUEUE[0] = bytes[0];
        INCOMING_QUEUE[1] = bytes[1];
        for i in ((prev_length + 2) as usize)..(curr_length as usize) {
            INCOMING_QUEUE[i] = data[i - ((prev_length + 2) as usize)];
        }
    }
}

#[no_mangle]
pub extern "C" fn ws_on_open() {
    unsafe {
        IS_OPEN = true;
    }
}

#[no_mangle]
pub extern "C" fn ws_on_close() {
    unsafe {
        IS_OPEN = false;
    }
}


#[no_mangle]
extern "C" {
    pub fn ws_send(outgoing_ptr: *const u8, length: u32);
}

#[no_mangle]
extern "C" {
    pub fn ws_initialise(incoming_ptr: *const u8);
}