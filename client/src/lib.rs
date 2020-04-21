extern crate console_error_panic_hook;

#[macro_use]
mod log;
mod renderer;

pub use renderer::*;
use std::panic;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

// use engine::

#[wasm_bindgen(start)]
pub fn start() -> Result<(), JsValue> {
    console_log!("starting bunkernz client");
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    
    let window = web_sys::window().unwrap();
    let renderer = Renderer::from(window).unwrap();

    Ok(())
}