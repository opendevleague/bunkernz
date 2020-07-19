use oxid::*;
use engine::legion::prelude::*;
use crate::components::*;

pub fn render_text() -> Box<fn(&mut World, &mut Resources)> {
    Box::new(|world: &mut World, _resources: &mut Resources| {
        draw_text_centred(
            "pre-alpha (as you can tell)",
            screen_width() * 0.5,
            25.,
            20.,
            WHITE
        );

        draw_text_centred(
            "BUNKERNZ",
            screen_width() * 0.5,
            55.,
            30.,
            WHITE
        );

        draw_text_centred(
            "discord.com/invite/gamedev",
            screen_width() * 0.5,
            95.,
            25.,
            WHITE
        );

        draw_text_centred(
            "move the player with arrow keys",
            screen_width() * 0.5,
            130.,
            20.0,
            WHITE
        );

    })
}