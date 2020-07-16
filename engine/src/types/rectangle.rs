use glam::Vec2;

#[derive(Clone)]
pub struct Rectangle {
    pub position: Vec2,
    pub size: Vec2,
}

impl Default for Rectangle {
    fn default() -> Rectangle {
        Rectangle::from(0.0, 0.0, 0.0, 0.0)
    }
}

impl Rectangle {
    pub fn from(x: f32, y: f32, width: f32, height: f32) -> Rectangle {
        Rectangle {
            position: Vec2::new(x, y),
            size: Vec2::new(width, height),
        }
    }

    pub fn left(&self) -> f32 {
        self.position.y()
    }

    pub fn right(&self) -> f32 {
        self.position.x() + self.size.x()
    }

    pub fn top(&self) -> f32 {
        self.position.y()
    }
    
    pub fn bottom(&self) -> f32 {
        self.position.y() + self.size.y()
    }
}