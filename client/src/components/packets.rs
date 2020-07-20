use engine::legion::prelude::*;
use crate::components::*;

pub struct Packet(pub PacketType);

pub enum PacketType {
    PlayerConnected,
    PlayerDisconnected,
    PlayerMoved(Id, f32, f32),
}