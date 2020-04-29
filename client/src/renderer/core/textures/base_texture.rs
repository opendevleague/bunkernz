use crate::renderer::core::framebuffer::Framebuffer;
use crate::renderer::core::textures::{
    GlTexture,
    Resource
};

#[derive(Clone)]
pub struct BaseTexture {
    pub resource: Resource,
    pub width: f32,
    pub height: f32,
    pub resolution: f32,
    dirtyId: u32,
    dityStyleId: u32,
    is_valid: bool,
    is_destroyed: bool,
    gl_textures: Vec<GlTexture>,
}

impl BaseTexture {
    fn from(resource: Resource, width: f32, height: f32) -> BaseTexture {
        BaseTexture {
            resource,
            width,
            height,
            resolution: 1.0,
            dirtyId: 0,
            dityStyleId: 0,
            is_valid: width > 0.0 && height > 0.0,
            is_destroyed: false,
            gl_textures: Vec::new()
        }
    }

    pub fn update(&mut self) {
        if !self.is_valid && self.width > 0.0 && self.height > 0.0 {
            self.is_valid = true;
            return;
        }

        self.dirtyId += 1;
        self.dityStyleId += 1;
    }
}