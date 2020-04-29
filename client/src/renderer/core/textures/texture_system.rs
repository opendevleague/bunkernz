use crate::renderer::core::textures::Texture;
use crate::renderer::Renderer;
use crate::renderer::core::framebuffer::FramebufferSystem;
use engine::*;

pub struct TextureSystem<'t> {
    pub current_texture:  Option<&'t mut Texture>,
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

impl<'t> TextureSystem<'t> {

    /// Bind the current texture.
    pub fn bind(
        &'t mut self,
        framebuffer_system: &'t mut FramebufferSystem,
        renderer: &'t mut Renderer<'t, 't>,
        texture: &'t mut Texture) 
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