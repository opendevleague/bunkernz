pub mod systems;
pub mod components;
mod net;

use oxid::*;
use std::thread;
use std::time::Duration;
use net::WebSocket;
use engine::legion::prelude::*;
use engine::tracing_subscriber;
use components::*;
use crate::components::packets::PacketType;

fn main() { 
    Window::new("bunkernz", run());
}

async fn run() {
    info!("Starting bunkernz client");
    
    // wait_seconds(2.).await;
    // WebSocket::send_bytes("Hi\0".as_bytes());
    // WebSocket::send_bytes(&[117, 0x0]);
    
    wait_seconds(1.).await;
    
    WebSocket::init(Box::new(|data: &[u8]| {
        info!("Received packet length: {}", data.len());
    }));
    
    let universe = Universe::new();
    let mut world = universe.create_world();
    let mut resources = Resources::default();
    
    let mut schedule = Schedule::builder()
        .add_system(systems::update_positions())
        .add_system(systems::render_players())
        .add_system(systems::handle_local_input())
        // This flushes all command buffers of all systems.
        .flush()
        .add_thread_local_fn(systems::add_player::add_player())
        .add_thread_local_fn(systems::render_text())
        .build();

    // Add local player.
    let entity = systems::add_player::insert_new_player(&mut world);
    world.add_tag(entity, LocalPlayer);
    
    loop {
        clear_background(BLACK);
        schedule.execute(&mut world, &mut resources);
        next_frame().await;
    }
}