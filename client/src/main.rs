pub mod systems;
pub mod components;
mod net;

use oxid::*;
use std::thread;
use std::time::Duration;
use engine::legion::prelude::*;
use engine::tracing_subscriber;
use components::*;
use crate::components::packets::PacketType;
use crate::net::INCOMING_QUEUE;

fn main() { 
    Window::new("bunkernz", run());
}

async fn run() {
    info!("Starting bunkernz client");
    let mut last_packet_length: usize = 0;
    
    net::initialise();
    wait_seconds(1.).await;
    
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
        
        // Websocket loop.
        let data: &[u8] = net::read_stream();
        last_packet_length = data.len();
        // Reset queue length.
        unsafe {
            net::INCOMING_QUEUE[0] = 0;
            net::INCOMING_QUEUE[1] = 0;
        }
        
        draw_text_centred(
            format!("Last packet bytes: {}", last_packet_length).as_str(),
            100.,
            screen_height()/2.,
            32.,
            WHITE
        );
        schedule.execute(&mut world, &mut resources);
        next_frame().await;
    }
}