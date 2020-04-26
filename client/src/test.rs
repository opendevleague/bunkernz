use engine::legion::prelude::*;
use js_sys::Promise;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::{JsFuture, spawn_local};
use web_sys::{
    Document, HtmlCanvasElement, WebGlBuffer, WebGlContextAttributes, WebGlProgram,
    WebGlRenderingContext, WebGlShader, Window,
};

#[wasm_bindgen(module = "/src/js/sleep.js")]
extern "C" {
    pub fn sleep(millis: i32)-> js_sys::Promise;
}

pub async fn timer(millis: i32) {
    let promise = sleep(millis);
    let future = JsFuture::from(promise);
    let resp = future.await;
}

#[wasm_bindgen(js_name = onWindowResize)]
pub fn on_window_resize(width: u16, height: u16) {
    console_log!("Received width {} and height {}", width, height);
}

#[derive(Clone, Debug, PartialEq)]
struct Position {
    x: f32,
    y: f32,
}

#[derive(Clone, Debug, PartialEq)]
struct Velocity {
    dx: f32,
    dy: f32,
}

pub async fn func() {
    // Legion + async example
    let universe = Universe::new();
    let mut world = universe.create_world();
    
    let query = <(Write<Position>, Read<Velocity>)>::query();
    // Create entities with `Position` and `Velocity` data
    world.insert(
        (),
        (0..2).map(|_| (Position { x: 0.0, y: 0.0 }, Velocity { dx: 0.0, dy: 0.0 }))
    );

    let mut update_positions = SystemBuilder::new("update_positions")
        .with_query(<(Write<Position>, Read<Velocity>)>::query())
        .build(|_, mut world, (), query| {
            for (mut pos, vel) in query.iter(&mut world) {
                pos.x += vel.dx;
                pos.y += vel.dy;
                console_log!("Pos {},{}", pos.x, pos.y);
            }
        });

    let fps = 40.0;
    let timestep = 1.0/fps;

    loop {
        update_positions.run(&world);
        timer((timestep * 1000.0) as i32).await;
    }
}