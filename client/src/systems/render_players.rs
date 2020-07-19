use oxid::*;
use engine::legion::prelude::*;
use crate::components::*;

pub fn render_players() -> Box<dyn Schedulable> {
    SystemBuilder::new("render_players")
        .with_query(<(Read<Pos>, Read<RenderCircle>)>::query())
        .build(|_, world, (), query| {
            for (pos, renderCircle) in query.iter_mut(world) {
                draw_circle(
                    screen_width() * 0.5 + pos.0, 
                    screen_height() * 0.5 +  pos.1, 
                    renderCircle.radius, 
                    YELLOW
                );
            }
        })
}