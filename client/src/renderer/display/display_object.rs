use engine::types::*;

pub struct DisplayObject {
    transform: Transform,
    is_sprite: bool,
    alpha: f32,
    z_index: i16,
    visible: bool,
}

impl Default for DisplayObject {
    fn default() -> DisplayObject {
        DisplayObject {
            transform: Default::default(),
            visible: true,
            is_sprite: false,
            alpha: 1.0,
            z_index: 0,
        }
    }
}

impl DisplayObject {
    pub fn destroy(&mut self) { }
}