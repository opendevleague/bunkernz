use glam::Vec2;

#[derive(Clone)]
pub struct Transform {
    position: Vec2,
    forward: Vec2,
}

impl Default for Transform {
    fn default() -> Transform {
        Transform {
            position: Vec2::new(0.0, 0.0),
            forward: Vec2::new(1.0, 0.0)
        }
    }
}

impl Transform {
    pub fn get_position(self) -> Vec2 {
        self.position
    }

    pub fn forward(self) -> Vec2 {
        self.forward
    }
}