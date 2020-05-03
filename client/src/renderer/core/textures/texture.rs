use js_sys::{
    ArrayBuffer,
    Float32Array,
    Uint32Array,
    Int8Array,
    Uint8Array,
    Int16Array,
    Uint16Array,
    Int32Array
};
use crate::renderer::core::textures::BaseTexture;

#[derive(Clone)]
pub struct Texture {
    pub base: BaseTexture,
    pub is_valid: bool,
    // pub uvs: TextureUVs
}

impl Texture {
    fn from(base: BaseTexture) -> Texture {
        Texture {
            base,
            is_valid: false,
        }
    }

    fn update(&mut self) {
        self.base.update();
    }
}