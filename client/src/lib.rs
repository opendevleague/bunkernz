extern crate console_error_panic_hook;

#[macro_use]
mod log;
mod renderer;
mod test;

pub use renderer::*;
use std::panic;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::{JsFuture, spawn_local};

#[wasm_bindgen(start)]
pub async fn start() -> Result<(), JsValue> {
    console_log!("starting bunkernz client");
    panic::set_hook(Box::new(console_error_panic_hook::hook));

    spawn_local(test::func());
    
    let window = web_sys::window().unwrap();
    let renderer = Renderer::from(window).unwrap();

    Ok(())
}