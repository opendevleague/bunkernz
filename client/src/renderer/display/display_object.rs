use engine::types::*;
use crate::renderer::{
    core::{
        Renderer,
        textures::Texture,
        batch::Batchable
    },
    display::{
        Renderable,
        Sprite,
    }
};

/// TODO: Make this into a trait.
pub struct DisplayContainer {
    pub width: f32,
    pub height: f32,
    pub visible: bool,
    pub children: Vec<Sprite>,
    transform: Transform,
    alpha: f32,
    z_index: i16,
    renderable: bool,
    destroyed: bool,
    // parent: Option<&'a DisplayContainer>,
}

impl Default for DisplayContainer {
    fn default() -> DisplayContainer {
        DisplayContainer {
            transform: Default::default(),
            visible: true,
            renderable: true,
            destroyed: false,
            alpha: 1.0,
            z_index: 0,
            children: vec![],
            height: 0.0,
            width: 0.0,
        }
    }
}

impl DisplayContainer {
    pub fn new(width: f32, height: f32) -> DisplayContainer {
        let mut display_object = DisplayContainer::default();
        display_object.width = width;
        display_object.height = height;
        
        display_object
    }
    
    pub fn render<'b, 'd:'b, 'r:'b>(&'r mut self, mut renderer: &mut Renderer<'_, 'b>) {
        if !self.visible {
            return;
        }
    
        // Render inner "batchables" (currently only sprites).
        for child in &mut self.children {
            child.render(&mut renderer);
        }
    }

    pub fn destroy(&mut self) { }
}