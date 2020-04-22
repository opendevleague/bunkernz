use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use std::cell::RefCell;
use std::rc::Rc;
use crate::core::{
    *,
    projection::*,
    batch::*,
    framebuffer::*,
    textures::*,
};
use crate::display;
use web_sys::{
    Window,
    Document,
    WebGlProgram,
    HtmlCanvasElement,
    WebGlRenderingContext,
    WebGlContextAttributes,
    WebGlShader,
    WebGlBuffer
};

pub struct Renderer {
    pub framebuffer_system: FramebufferSystem<'static>,
    pub batch_system: BatchSystem,
    pub texture_system: TextureSystem<'static>,
    pub projection_system: ProjectionSystem,
    pub ctx: WebGlRenderingContext,
    window: Window,
    canvas: HtmlCanvasElement,
}

impl Renderer {
    pub fn from(window: Window) -> Result<Renderer, JsValue> {
        let canvas = window.document().unwrap().get_element_by_id("canvas").unwrap();
        let canvas: web_sys::HtmlCanvasElement = canvas.dyn_into::<web_sys::HtmlCanvasElement>()?;

        let ctx = canvas
            .get_context("webgl")?
            .unwrap()
            .dyn_into::<WebGlRenderingContext>()?;

        let mut renderer = Renderer {
            framebuffer_system: Default::default(),
            batch_system: Default::default(),
            texture_system: Default::default(),
            projection_system: Default::default(),
            window,
            canvas,
            ctx,
        };

        let mut attributes: WebGlContextAttributes = renderer.ctx
            .get_context_attributes()
            .unwrap();

        attributes.antialias(false);

        // let width = renderer.window.inner_width().unwrap().as_f64().unwrap();
        // let height = renderer.window.inner_height().unwrap().as_f64().unwrap();

        let vert_shader = webgl::compile_shader(
            &renderer.ctx,
            WebGlRenderingContext::VERTEX_SHADER,
            r#"
            attribute vec4 position;
            void main() {
                gl_Position = position;
            }
        "#,
        )?;
        let frag_shader = webgl::compile_shader(
            &renderer.ctx,
            WebGlRenderingContext::FRAGMENT_SHADER,
            r#"
            void main() {
                gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
            }
        "#,
        )?;
        let program = webgl::link_program(&renderer.ctx, &vert_shader, &frag_shader)?;
        renderer.ctx.use_program(Some(&program));

        
        renderer.clear();
        
        let vertices: [f32; 9] = [
            -0.7, -0.7, 0.0,
            0.7, -0.7, 0.0,
            0.0, 0.7, 0.0
        ];
        renderer.render_polygon(&vertices);
        
        let square: [f32; 12] = [
            0.1, 0.1, 0.0,
            0.1, 0.2, 0.0,
            0.2, 0.2, 0.0,
            0.2, 0.1, 0.0
        ];
        renderer.render_polygon(&square);
        
        renderer.setup_animation_frame();
        
        Ok(renderer)
    }

    pub fn render(&mut self, object: &mut dyn display::Renderable, texture: &mut textures::Texture) {
        // self.renderTextureSystem.bind(texture);
        // self.batch.currentRenderer.start();
        // Clear canvas before render.
        // self.renderTextureSystem.clear();
        object.render(self);
        // Apply transform.
        // self.batch.currentRenderer.flush();
        texture.base.update();
    }

    fn setup_animation_frame(&mut self) {
        //let mut rc = Rc::new(self);
        let f = Rc::new(RefCell::new(None));
        let g = f.clone();

        let c = move || {
            //if let Some(the_self) = Rc::get_mut(&mut rc) {
			    // the_self.frame_callback();
            //};

            Renderer::request_animation_frame(f.borrow().as_ref().unwrap());
        };

        *g.borrow_mut() = Some(Closure::wrap(Box::new(c) as Box<dyn FnMut()>));
        Renderer::request_animation_frame(g.borrow().as_ref().unwrap());
    }

    fn window() -> web_sys::Window {
        web_sys::window().expect("no global `window` exists")
    }
    
    fn request_animation_frame(f: &Closure<dyn FnMut()>) {
        Renderer::window()
            .request_animation_frame(f.as_ref().unchecked_ref())
            .expect("should register `requestAnimationFrame` OK");
    }
    
    fn document() -> web_sys::Document {
        Renderer::window()
            .document()
            .expect("should have a document on window")
    }

    /// Clear the frame buffer.
    pub fn clear(&mut self) {
        self.ctx.clear_color(0.0, 0.0, 0.0, 1.0);
        self.ctx.clear(WebGlRenderingContext::COLOR_BUFFER_BIT);
    }

    /// Resize the WebGL view.
    pub fn resize(&mut self, width: u16, height: u16) { }

    fn render_polygon(&mut self, vertices: &[f32], ) -> Result<(), JsValue> {
        let buffer = self.ctx.create_buffer().ok_or("failed to create buffer")?;
        self.ctx.bind_buffer(WebGlRenderingContext::ARRAY_BUFFER, Some(&buffer));

        // Note that `Float32Array::view` is somewhat dangerous (hence the
        // `unsafe`!). This is creating a raw view into our module's
        // `WebAssembly.Memory` buffer, but if we allocate more pages for ourself
        // (aka do a memory allocation in Rust) it'll cause the buffer to change,
        // causing the `Float32Array` to be invalid.
        //
        // As a result, after `Float32Array::view` we have to be very careful not to
        // do any memory allocations before it's dropped.
        unsafe {
            let vert_array = js_sys::Float32Array::view(&vertices);

            self.ctx.buffer_data_with_array_buffer_view(
                WebGlRenderingContext::ARRAY_BUFFER,
                &vert_array,
                WebGlRenderingContext::STATIC_DRAW,
            );
        }

        self.ctx.vertex_attrib_pointer_with_i32(0, 3, WebGlRenderingContext::FLOAT, false, 0, 0);
        self.ctx.enable_vertex_attrib_array(0);

        self.ctx.draw_arrays(
            WebGlRenderingContext::LINE_LOOP,
            0,
            (vertices.len() / 3) as i32,
        );

        self.ctx.delete_buffer(Some(&buffer));
        
        Ok(())
    }
}