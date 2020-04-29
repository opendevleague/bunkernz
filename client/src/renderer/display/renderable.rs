use std::cell::Cell;
use crate::renderer::*;

pub trait Renderable {
    /// 'b = batch renderer
    /// 'r = renderable
    fn render<'r>(&'r mut self, renderer: &mut Renderer<'_, 'r>);
}