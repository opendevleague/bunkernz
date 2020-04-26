use crate::core::textures::Texture;
use crate::Renderer;
use crate::core::framebuffer::FramebufferSystem;
use engine::*;

pub struct TextureSystem<'a> {
    pub current_texture:  Option<&'a mut Texture>,
    source_frame: types::Rectangle,
    destination_frame: types::Rectangle,
}

impl Default for TextureSystem<'_> {
    fn default() -> TextureSystem<'static> {
        TextureSystem {
            current_texture: Option::None,
            source_frame: Default::default(),
            destination_frame: Default::default(),
        }
    }
}

impl<'a> TextureSystem<'a> {

    /// Bind the current texture.
    pub fn bind(
        &'a mut self,
        framebuffer_system: &'a mut FramebufferSystem,
        renderer: &'a mut Renderer<'a>,
        texture: &'a mut Texture) 
    {
        // Update current texture.
        self.current_texture = Some(texture);
        let texture = self.current_texture.as_mut().unwrap();

        let mut rect: types::Rectangle = Default::default();
        // if no destination frame...
        rect.size.x = texture.base.width;
        rect.size.y = texture.base.height;
        self.destination_frame = rect;

        // if no source frame...
        self.source_frame = self.destination_frame.clone();

        // TODO
        // framebuffer_system.bind(renderer, texture.base.framebuffer/*, self.destination_frame*/);
        renderer.projection_system.update(
            // &renderer,
            &self.destination_frame,
            &self.source_frame,
            texture.base.resolution,
            false
        );
        // self.renderer.mask.set_mask_stack(texture.base.maskStack);

        // Update destination frame according to the texture's resolution.
        self.destination_frame.position.x /= texture.base.resolution;
        self.destination_frame.position.y /= texture.base.resolution;
        self.destination_frame.size.x /= texture.base.resolution;
        self.destination_frame.size.y /= texture.base.resolution;
    }

    // TODO
    pub fn unbind(renderer: &Renderer) { }
}