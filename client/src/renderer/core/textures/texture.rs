use crate::core::textures::BaseTexture;

pub struct Texture {
    pub base: BaseTexture,
    is_valid: bool,
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