use crate::display::{
    DisplayObject,
    Renderable
};
use engine::types::*;
use engine::*;

pub struct Sprite {
    display_object: DisplayObject,
    anchor: nalgebra::Vector2<f32>,
    width: u16,
    height: u16,
    vertexData: Vec<f32>,
}

impl Default for Sprite {
    fn default() -> DisplayObject {
        DisplayObject {
            transform: Default::default(),
            anchor: nalgebra::Vector2::new(0.0, 0.0),
            visible: true,
            is_sprite: false,
            alpha: 1.0,
            z_index: 0,
        }
    }
}

impl Renderable for Sprite {
    fn render(renderer: &Renderer) {
        if !self.visible {
            return;
        }

        // TODO: Implement mask/filters?
        self.calculateVertices();
        // renderer.batch.render(self);
        // TOOD: Render children.
    }
}

impl Sprite {
    pub fn destroy(&mut self) { }

    fn calculateVertices(&mut self) {
        
    }
}
