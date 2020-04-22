use nalgebra::*;

#[derive(Clone)]
pub struct Transform {
    position: Vector2<f32>,
    forward: Vector2<f32>,
}

impl Default for Transform {
    fn default() -> Transform {
        Transform {
            position: Vector2::new(0.0, 0.0),
            forward: Vector2::new(1.0, 0.0)
        }
    }
}

impl Transform {
    pub fn get_position(self) -> Vector2<f32> {
        self.position
    }

    pub fn forward(self) -> Vector2<f32> {
        self.forward
    }
}