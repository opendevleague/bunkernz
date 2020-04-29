use crate::renderer::core::textures::BaseTexture;

#[derive(Clone)]
pub struct Texture {
    pub base: BaseTexture,
    pub is_valid: bool,
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