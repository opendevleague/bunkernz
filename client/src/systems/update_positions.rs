use oxid::*;
use engine::legion::prelude::*;
use crate::components::*;

pub fn update_positions() -> Box<dyn Schedulable> {
    SystemBuilder::new("update_positions")
        .with_query(<(Write<Pos>, Read<LocalInput>)>::query())
        .build(|_, world, (), query| {
            for (mut pos, input) in query.iter_mut(world) {
                pos.0 += input.0;
                pos.1 += input.1;
            }
        })
}