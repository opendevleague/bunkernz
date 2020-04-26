use crate::core::framebuffer::GlFramebuffer;

pub struct Framebuffer {
    pub gl: GlFramebuffer,
    pub dirtyId: u32,
    pub dirtyFormat: u32,
    pub dirtySize: u32,
    pub width: f32,
    pub height: f32,
    use_stencil: bool,
    use_depth: bool,
}

impl Framebuffer {
    pub fn from(width: f32, height: f32) -> Framebuffer {
        Framebuffer {
            gl: Default::default(),
            width,
            height,
            use_stencil: false,
            use_depth: false,
            dirtyId: 0,
            dirtyFormat: 0,
            dirtySize: 0,
        }

        // add color texture(0, self)
    }
}