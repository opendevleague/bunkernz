use engine::types::*;
use engine::*;
use nalgebra::*;
use std::cell::Cell;
use crate::renderer::display::{
    DisplayContainer,
    Renderable
};
use crate::renderer::core::{
    Renderer,
    textures::Texture,
    batch::Batchable
};

#[derive(Clone)]
pub struct Sprite {
    pub dc: DisplayContainer,
    pub indices: Vec<u16>,
    pub vertex: Vec<f32>,
    pub texture: Box<Texture>,
    pub anchor: nalgebra::Vector2<f32>,
}

impl Renderable for Sprite {
    fn render<'r>(&'r mut self, renderer: &mut Renderer<'_, 'r>) {
        if !self.dc.visible {
            return;
        }

        // TODO: Implement mask/filters?
        self.calculateVertices();
        let batchable = Batchable::Sprite(self);
        renderer.batch.render(batchable);
        // TOOD: Render children.
    }
}

impl Sprite {
    pub fn from(texture: Texture) -> Sprite {
        Sprite {
            dc: DisplayContainer::new(texture.base.width, texture.base.height),
            anchor: Vector2::new(0.5, 0.5),
            texture: Box::new(texture),
            indices: vec![],
            vertex: vec![],
        }
    }

    pub fn destroy(&mut self) { }

    pub fn set_width(&mut self, width: f32) {
        self.dc.width = width;
    }

    pub fn set_height(&mut self, height: f32) {
        self.dc.height = height;
    }

    fn calculateVertices(&mut self) {
        
    }
}
