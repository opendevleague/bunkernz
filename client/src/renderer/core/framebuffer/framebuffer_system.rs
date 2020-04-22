use crate::Renderer;
use crate::core::framebuffer::{
    Framebuffer,
    GlFramebuffer,
};
use web_sys::WebGlRenderingContext;
use engine::types::Rectangle;

pub struct FramebufferSystem<'a> {
    current_index: Option<usize>,
    managed_framebuffers: Vec<&'a mut Framebuffer>,
    viewport: Rectangle,
}

impl Default for FramebufferSystem<'_> {
    fn default() -> FramebufferSystem<'static> {
        FramebufferSystem {
            current_index: Option::None,
            managed_framebuffers: Vec::new(),
            viewport: Default::default()
        }
    }
}

impl<'a> FramebufferSystem<'a> {
    fn is_same_object<T>(a: &T, b: &T) -> bool {
        a as *const T == b as *const T
    }

    pub fn get_current(&'a mut self) -> Option<&'a mut Framebuffer> {
        if let Some(current_index) = self.current_index {
           return Some(self.managed_framebuffers[current_index]);
        } else {
            return None;
        }
    }

    pub fn set_current(&mut self, framebuffer: &'a mut Framebuffer) {
        self.current_index = Some(self.managed_framebuffers.len());
        self.managed_framebuffers.push(framebuffer);
    }

    /// Bind a framebuffer.
    pub fn bind(&'a mut self, renderer: &Renderer, framebuffer: &'a mut Framebuffer) {
        let ctx = &renderer.ctx;

        let fbo: &mut GlFramebuffer;
        let current: Option<&'a mut Framebuffer> = self.get_current();
        
        match self.current_index {
            Some(index) => {
                // Use current framebuffer for fbo.
                fbo = &mut current.unwrap().gl_framebuffer;
                // Check for updates...
                if fbo.dirtyId != framebuffer.dirtyId {
                    fbo.dirtyId = framebuffer.dirtyId;

                    if fbo.dirtyFormat != framebuffer.dirtyFormat {
                        fbo.dirtyFormat = framebuffer.dirtyFormat
                        // self.update_framebufer(framebuffer);
                    } else if fbo.dirtySize != framebuffer.dirtySize {
                        fbo.dirtySize = framebuffer.dirtySize
                        // self.resize_framebuffer(framebuffer);
                    }
                }
            }
            None => {
                // Set new framebuffer for fbo.
                self.set_current(framebuffer);
                // Create new framebuffer.
                framebuffer.gl_framebuffer.framebuffer = ctx.create_framebuffer();
                ctx.bind_framebuffer(WebGlRenderingContext::FRAMEBUFFER, fbo.framebuffer.as_ref());
                fbo = &mut framebuffer.gl_framebuffer;
            }
        }

        let current: &'a mut Framebuffer = current.unwrap();

        // Check and update the framebuffer if 
        if !FramebufferSystem::is_same_object(current, &framebuffer) {
            self.current_index = Some(self.managed_framebuffers.len());

            let webgl_fb = &framebuffer.gl_framebuffer.framebuffer;
            
        }

        // for i in 0..framebuffer.color_textures.length {
        //     renderer.texture_system.unbind(framebuffer.color_textures[i]);
        // }

        // if framebuffer.depth_texture.is_some() {
        //     renderer.texture_system.unbind(framebuffer.depth_texture);
        // }

        self.set_viewport(&ctx, 0.0, 0.0, framebuffer.width, framebuffer.height);
    }

    // Unbind the current framebuffer.
    pub fn unbind() { }

    fn retrieve_or_create_glframebuffer(&mut self, ctx: &WebGlRenderingContext, framebuffer: &'a mut Framebuffer) -> &mut GlFramebuffer {
        if framebuffer.gl_framebuffer.framebuffer.is_some() {
            return &mut framebuffer.gl_framebuffer;
        }

        framebuffer.gl_framebuffer.framebuffer = ctx.create_framebuffer();
        self.managed_framebuffers.push(framebuffer);

        &mut framebuffer.gl_framebuffer
    }

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

/*
if there is a mutable reference &T there can't be
any other reference (mutable or not) &T.
*/

struct Bar {
    value: u8,
}

struct Foo<'a> {
    x: Option<&'a mut Bar>,
    x_list: Vec<&'a mut Bar>,
}

impl<'a> Foo<'a> {
    pub fn func(&mut self, bar: &'a mut Bar) {
        if let Some(inner) = &mut self.x {
            if !Foo::is_same_object(inner, &bar) {
                self.x = Some(bar);
                self.x_list.push(bar);
            }
        }
    }

    fn is_same_object<T>(a: &T, b: &T) -> bool {
        a as *const T == b as *const T
    }
}