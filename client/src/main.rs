use oxid::*;

fn main() { 
    Window::new("bunkernz", run());
}

async fn run() {
    info!("Starting bunkernz client");
    
    loop {
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