use crate::renderer::Renderer;

pub trait System {
    renderer: Renderer;
}