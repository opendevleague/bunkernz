use web_sys::Window;
use crate::renderer::display::{DisplayContainer, Renderable};
use crate::renderer::core::Renderer;

pub struct Application<'r> {
    container: DisplayContainer,
    renderer: Renderer<'r, 'r>,
}

impl<'r> Application<'r> {
    pub fn new(window: Window) -> Application<'r> {
        Application {
            container: DisplayContainer::default(),
            renderer: Renderer::from(window).unwrap(),
        }
    }

    pub fn render<'a: 'r>(&'a mut self) {
        self.renderer.render(&mut self.container);
    }
}