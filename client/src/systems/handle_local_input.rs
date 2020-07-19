use oxid::*;
use engine::legion::prelude::*;
use crate::components::*;

pub fn handle_local_input() -> Box<dyn Schedulable> {
    SystemBuilder::new("handle_local_input")
        .with_query(<(Write<LocalInput>)>::query())
        .build(|_, world, (), query| {
            for (mut input) in query.iter_mut(world) {
                info!("Modifying input");
                if is_key_down(KeyCode::Right) {
                    input.0 += 1.;
                } else if is_key_down(KeyCode::Left) {
                    input.0 -= 1.;
                } else {
                    input.0 = 0.;
                }

                if is_key_down(KeyCode::Down) {
                    input.1 += 1.;
                } else if is_key_down(KeyCode::Up) {
                    input.1 -= 1.;
                } else {
                    input.1 = 0.;
                }
            }
        })
}