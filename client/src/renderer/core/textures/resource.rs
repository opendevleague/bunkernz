use crate::renderer::core::textures::BaseTexture;

#[derive(PartialEq)]
pub struct Resource {
    width: u16,
    height: u16,
    is_destroyed: bool,
}

impl Resource {
    fn from(width: u16, height: u16) -> Resource {
        Resource {
            width,
            height,
            is_destroyed: false,
        }
    }

    pub fn update(&mut self) {
        if self.is_destroyed {
            ()
        }
        
        // emit on_update
    }
}