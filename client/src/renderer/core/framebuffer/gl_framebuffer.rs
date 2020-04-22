use web_sys::WebGlFramebuffer;

pub struct GlFramebuffer {
    pub framebuffer: Option<WebGlFramebuffer>,
    pub dirtyId: u32,
    pub dirtyFormat: u32,
    pub dirtySize: u32,
}

impl Default for GlFramebuffer {
    fn default() -> GlFramebuffer {
        GlFramebuffer::from(Option::None)
    }
}

impl GlFramebuffer {
    fn from(framebuffer: Option<WebGlFramebuffer>) -> GlFramebuffer {
        GlFramebuffer {
            framebuffer,
            dirtyId: 0,
            dirtyFormat: 0,
            dirtySize: 0,
        }
    }
}