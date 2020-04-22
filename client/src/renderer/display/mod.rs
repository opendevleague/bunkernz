mod display_object;

pub use display_object::DisplayObject;
use crate::core::Renderer;

pub trait Renderable {
    fn render(&mut self, renderer: &Renderer);
}