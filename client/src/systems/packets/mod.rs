use oxid::*;
use engine::legion::prelude::*;
use crate::components::packets::*;
use crate::net::WebSocket;
use crate::components::*;

// TODO: use build scripts.
// https://doc.rust-lang.org/cargo/reference/build-scripts.html

fn packet_handler() -> Box<dyn Schedulable> {
    SystemBuilder::new("packet_handler")
        .with_query(<(Read<Packet>)>::query())
        .build(|cb, world, resources, query| {
            for (packet) in query.iter_mut(world) {
                match packet.0 {
                    PacketType::PlayerConnected => { player_connected(cb); }
                    PacketType::PlayerDisconnected => { player_disconnected(cb); }
                    _ => { }
                }
            }
        })
}

pub fn new(packet: PacketType) {
    match packet {
        PacketType::PlayerMoved(id, x, y) => {
            write_player_moved((id, x, y)); 
        }
        _ => { }
    }
}

fn write_player_moved(data: (Id, f32, f32)) {
    WebSocket::send_bytes(&[
        PacketType::PlayerMoved as u8
    ]);
}

fn player_connected(cb: &mut CommandBuffer) {
    info!("player connected");
}

fn player_disconnected(cb: &mut CommandBuffer) {
    info!("player disconnected");
}