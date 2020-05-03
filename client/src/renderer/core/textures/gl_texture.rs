use web_sys::WebGlTexture;

/// Internal struct for WebGL context.
#[derive(Clone, PartialEq)]
pub struct GlTexture {
    texture: WebGlTexture,
    width: u16,
    height: u16,
    dirtyId: u32,
    dirtyStyleId: u32
}

impl GlTexture {
    fn from(texture: WebGlTexture, width: u16, height: u16) -> GlTexture {
        GlTexture {
            texture,
            width,
            height,
            dirtyId: 0,
            dirtyStyleId: 0
        }
    }
}