use oxid::*;
use engine::legion::prelude::*;
use crate::components::*;
use crate::systems;
use crate::components::packets::*;

pub fn update_positions() -> Box<dyn Schedulable> {
    SystemBuilder::new("update_positions")
        .with_query(<(
            Write<Pos>,
            Read<Id>,
            Read<Input>,
        )>::query())
        .build(|cb, world, _, query| {
            for (mut pos, id, input) in query.iter_mut(world) {
                pos.0 += input.0;
                pos.1 += input.1;

                systems::packets::new(PacketType::PlayerMoved(*id, pos.0, pos.1));
            }
        })
}