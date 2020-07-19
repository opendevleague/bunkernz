use oxid::*;
use std::thread;
use std::time::Duration;

mod wasm;

fn main() { 
    Window::new("bunkernz", run());
}

async fn run() {
    info!("Starting bunkernz client");
    
    loop {
        wait_seconds(2.).await;
        wasm::ws_send_str("test message");
        
        clear_background(BLACK);

        draw_text_centred(
            "pre-alpha live soon",
            screen_width() * 0.5,
            screen_height() * 0.5 - 30. - 25.,
            25.,
            WHITE
        );
        
        draw_text_centred(
            "BUNKERNZ",
            screen_width() * 0.5,
            screen_height() * 0.5,
            30.,
            WHITE
        );

        draw_text_centred(
            "discord.com/invite/gamedev",
            screen_width() * 0.5,
            screen_height() * 0.5 + 30. + 25.,
            25.,
            WHITE
        );
        
        next_frame().await;
    }
}