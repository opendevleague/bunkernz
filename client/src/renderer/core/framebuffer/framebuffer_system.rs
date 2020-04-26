use crate::Renderer;
use crate::core::framebuffer::{
    Framebuffer,
    GlFramebuffer,
};
use web_sys::WebGlRenderingContext;
use engine::types::Rectangle;

pub struct FramebufferSystem {
    current_index: Option<usize>,
    managed: Vec<Framebuffer>,
    viewport: Rectangle,
}

impl Default for FramebufferSystem {
    fn default() -> FramebufferSystem {
        FramebufferSystem {
            current_index: Option::None,
            managed: Vec::new(),
            viewport: Default::default()
        }
    }
}

impl FramebufferSystem {
    fn is_same_object<T>(a: &T, b: &T) -> bool {
        a as *const T == b as *const T
    }

    pub fn get_current(&mut self) -> Option<&mut Framebuffer> {
        if let Some(current_index) = self.current_index {
           return Some(&mut self.managed[current_index]);
        } else {
            return None;
        }
    }

    pub fn set_current(&mut self, framebuffer: Framebuffer) -> &mut Framebuffer {
        let i = self.managed.len();
        self.current_index = Some(i);
        self.managed.push(framebuffer);

        &mut self.managed[i]
    }

    /// Bind a framebuffer.
    /// TODO Fix this function
    pub fn bind(&mut self, renderer: &Renderer, mut framebuffer: Framebuffer) {
        let ctx = &renderer.ctx;

        let fbo: &mut GlFramebuffer = {
            // if framebuffer.gl.data.is_none() {
            //     framebuffer.gl.data = ctx.create_framebuffer();
            //     self.set_current(framebuffer);
            // }
            
            &mut framebuffer.gl
        };

        let current: &mut Framebuffer = self.get_current().unwrap();

        // if framebuffer.gl.data.is_none() {
        //     // Initialise framebuffer
        //     framebuffer.gl.data = ctx.create_framebuffer();
        //     // if current !== frame
        //     let current = self.set_current(*framebuffer);
        //     &mut current.gl
        // }

        if fbo.dirtyId != current.dirtyId {
            fbo.dirtyId = current.dirtyId;

            if fbo.dirtyFormat != current.dirtyFormat {
                fbo.dirtyFormat = current.dirtyFormat;
                // self.update_framebufer(framebuffer);
            } else if fbo.dirtySize != current.dirtySize {
                fbo.dirtySize = current.dirtySize;
                // self.resize_framebuffer(framebuffer);
            }
        }

        // Check and update the framebuffer if 
        // if !FramebufferSystem::is_same_object(current, &framebuffer) {
        //     self.current_index = Some(self.managed.len());

        //     let webgl_fb = &framebuffer.gl_framebuffer.framebuffer;
            
        // }

        // for i in 0..framebuffer.color_textures.length {
        //     renderer.texture_system.unbind(framebuffer.color_textures[i]);
        // }

        // if framebuffer.depth_texture.is_some() {
        //     renderer.texture_system.unbind(framebuffer.depth_texture);
        // }

        // self.set_viewport(&ctx, 0.0, 0.0, framebuffer.width, framebuffer.height);
    }

    // Unbind the current framebuffer.
    pub fn unbind() { }

    fn set_viewport(&mut self, ctx: &WebGlRenderingContext, x: f32, y: f32, width: f32, height: f32) {
        let should_update = self.viewport.size.x != width ||
            self.viewport.size.y != height ||
            self.viewport.position.x != x ||
            self.viewport.position.y != y;

        if !should_update {
            return;
        }

        self.viewport.position.x = x;
        self.viewport.position.y = y;
        self.viewport.size.x = width;
        self.viewport.size.y = height;

        ctx.viewport(x as i32, y as i32, width as i32, height as i32);
    }
}