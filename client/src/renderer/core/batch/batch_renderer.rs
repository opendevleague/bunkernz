use std::{
    any::Any,
    cell::RefCell
};
use wasm_bindgen::prelude::*;
use web_sys::WebGlRenderingContext;
use js_sys::{
    ArrayBuffer,
    Float32Array,
    Uint32Array,
    Int8Array,
    Uint8Array,
    Int16Array,
    Uint16Array,
    Int32Array
};
use crate::renderer::{
    ViewableBuffer,
    Renderer,
    core::{
        webgl::State,
        textures::BaseTexture,
        textures::TextureSystem
    },
    display::{
        Sprite
    }
};

pub enum Batchable<'s> {
    Sprite(&'s Sprite),
}

pub struct BatchRenderer<'s> {
    state: State,
    size: usize,
    // shader_generator: ShaderGenerator,
    vertex_size: u32,
    vertex_count: usize,
    index_count: usize,
    buffered_elements: Vec<Option<&'s Sprite>>,
    buffered_textures: Vec<&'s BaseTexture>,
    texture_array_pool: Vec<BatchTextureArray<'s>>,
    draw_call_pool: Vec<BatchDrawllCall<'s>>,
    buffer_size: usize,
    // shader: Shader,
    flush_id: i32,
    a_buffers: Vec<ViewableBuffer>,
    i_buffers: Vec<Option<Uint16Array>>,
    dc_index: usize, // not DisplayContainer
    a_index: u32,
    /// Pointer index to current buffer (?).
    i_index: u32,
    attribute_buffer: Option<ViewableBuffer>,
    index_buffer: Option<usize>,
    temp_bound_textures: Vec<&'s BaseTexture>,
}

impl<'s> Default for BatchRenderer<'s> {
    fn default() -> BatchRenderer<'s> {
        BatchRenderer {
            state: Default::default(),
            vertex_size: 0,
            vertex_count: 0,
            // the n of bufferable objects before a flush occurs automatically
            size: 8, // SPRITE_BATCH_SIZE * 4
            index_count: 0,
            buffer_size: 0,
            dc_index: 0,
            a_index: 0,
            i_index: 0,
            flush_id: 0,
            attribute_buffer: None,
            a_buffers: vec![],
            buffered_elements: vec![],
            buffered_textures: vec![],
            temp_bound_textures: vec![],
            index_buffer: None,
            i_buffers: vec![],
            texture_array_pool: vec![],
            draw_call_pool: vec![],
        }
    }
}

impl<'s> BatchRenderer<'s> {
    const MAX_TEXTURES: u8 = 1;

    // This currently only renders sprites.
    // Ideally the Batchable enum will be a trait.
    pub fn render(&mut self, ctx: &RefCell<WebGlRenderingContext>, texture_system: &TextureSystem, batchable: Batchable<'s>) {
        let sprite = if let Batchable::Sprite(sprite) = batchable { sprite } else {
            return;
        };

        if !sprite.texture.is_valid {
            return;
        }

        let element_vertex_count = sprite.vertex.len()/2;

        // Flush if the element count overflows the max vertex count allowed.
        if self.vertex_count + element_vertex_count > self.size {
            self.flush(ctx, texture_system);
        }

        self.vertex_count += element_vertex_count;
        self.index_count += sprite.indices.len();
        self.buffered_textures[self.buffer_size] = &sprite.texture.base;
        self.buffered_elements[self.buffer_size] = Some(&sprite);

        // TODO remove this
        self.flush(ctx, texture_system);
    }

    fn flush(&mut self, ctx: &RefCell<WebGlRenderingContext>, texture_system: &TextureSystem) {
        if self.vertex_count == 0 {
            return;
        }

        // this.attribute_buffer = this.getAttributeBuffer(this._vertexCount);
        self.index_buffer = Some(self.get_index_buffer(self.index_count));
        self.a_index = 0;
        self.i_index = 0;
        self.dc_index = 0;

        self.build_textures_and_draw_calls(texture_system);
        // self.updateGeometry();
        self.draw_batches(ctx);

        // reset elements buffer for the next flush
        self.buffer_size = 0;
        self.vertex_count = 0;
        self.index_count = 0;
    }

    fn get_index_buffer(&mut self, size: usize) -> usize {
        // 12 indices is enough for 2 quads
        let rounded_p2: i32 = Self::next_pow2(f32::ceil(size as f32 / 12.0) as i32);
        let rounded_size_index: usize = Self::log2(rounded_p2) as usize;
        let rounded_size: i32 = rounded_p2 * 12;

        if self.i_buffers.len() <= rounded_size_index {
            self.i_buffers.push(None);
        }

        let buffer = &self.i_buffers[rounded_size_index as usize];

        if buffer.is_none() {
            let js_value = JsValue::from_f64(rounded_size as f64);
            self.i_buffers[rounded_size_index] = Some(Uint16Array::new(&js_value));
        }

        rounded_size_index
    }

    fn build_textures_and_draw_calls(&mut self, texture_system: &TextureSystem) {
        // let touch = renderer.textureGC.count;

        // BaseTexture._globalBatch += 1;
        // let mut TICK = BaseTexture._globalBatch; // TODO FIX THIS
        let mut TICK: u16 = 0;
        let countTexArrays = 0;
        let tex_array = &self.texture_array_pool[0];
        let start = 0;

        Self::copy_bound_textures(&mut self.temp_bound_textures, texture_system);

        for i in 0..self.buffer_size {
            let tex = self.buffered_textures[i];

            if tex.batch_enabled == TICK {
                continue;
            }
            
            if tex_array.count >= (Self::MAX_TEXTURES as u16) {
                Self::bound_array(tex_array, &self.temp_bound_textures, TICK);
                self.build_draw_calls(tex_array, start, i);
                start = i;
                countTexArrays += 1;
                tex_array = &self.texture_array_pool[countTexArrays];
                TICK += 1;
            }
            
            tex.batch_enabled = TICK;
            // tex.touched = touch;
            tex_array.elements[tex_array.count as usize] = tex;
            tex_array.count += 1;
        }

        self.buffered_textures.clear();
        
        if tex_array.count > 0 {
            Self::bound_array(tex_array, &self.temp_bound_textures, TICK);
            self.build_draw_calls(tex_array, start, self.buffer_size);
            countTexArrays += 1;
            TICK += 1;
        }

        self.temp_bound_textures.clear();
        // BaseTexture._globalBatch = TICK;
    }

    fn build_draw_calls(&mut self, texture_array: &BatchTextureArray, start: usize, finish: usize) {
        let draw_calls = &self.draw_call_pool;
        let draw_call = draw_calls[self.dc_index];

        draw_call.start = self.i_index;
        draw_call.tex_array = Some(*texture_array);

        for i in start..finish {
            let sprite = self.buffered_elements[i].unwrap();
            let tex = sprite.texture.base;
            // let sprite_blend_mode = premultiplyBlendMode[
            //     if tex.alphaMode { 1 } else { 0 }][sprite.blendMode
            // ];

            self.buffered_elements[i] = None;

            if start < i /*&& draw_call.blend != sprite_blend_mode*/ {
                draw_call.size = self.i_index - draw_call.start;
                start = i;
                self.dc_index += 1;
                draw_call = draw_calls[self.dc_index];

                if draw_call.tex_array.is_none() {
                    draw_call.tex_array = Some(*texture_array);
                }

                draw_call.start = self.i_index;
            }

            self.pack_interleaved_geometry(Batchable::Sprite(sprite));
            self.a_index += sprite.vertex.len() as u32 / 2 * self.vertex_size;
            self.i_index += sprite.indices.len() as u32;

            // draw_call.blend = sprite_blend_mode;
        }

        if start < finish {
            draw_call.size = self.i_index - draw_call.start;
            self.dc_index += 1;
        }
    }

    fn draw_batches(&mut self, ctx: &RefCell<WebGlRenderingContext>, state: &StateSystem) {
        let draw_calls = &self.draw_call_pool;
        let curTexArray = null;

        // Upload textures and do the draw calls
        for i in 0..self.dc_index {
            let texArray = draw_calls[i].texArray;
            // let type = draw_calls[i].type;
            // let blend = draw_calls[i].blend;
            let size = draw_calls[i].size;
            let start = draw_calls[i].start;

            if curTexArray != texArray {
                curTexArray = texArray;
                self.bind_and_clear_tex_array(texArray);
            }

            // this.state.blendMode = blend;
            // stateSystem.set(this.state);
            // ctx.draw_elements(type, size, gl.UNSIGNED_SHORT, start * 2); // TODO Use this
            // ctx.draw_elements(TYPE, size, gl.UNSIGNED_SHORT, start * 2);
        }
    }

    /// Round to the next power of two.
    fn next_pow2(v: i32) -> i32 {
        if v == 0 {
            v += 1;
        }
        
        v -= 1;

        v |= v >> 1;
        v |= v >> 2;
        v |= v >> 4;
        v |= v >> 8;
        v |= v >> 16;

        v + 1
    }

    /// Compute the ceil of log base 2
    fn log2(v: i32) -> i32 {
        let r = if v > 0xFFFF { 1 } else { 0 } << 4;

        v >>= r;

        let shift = if v > 0xFF { 1 } else { 0 } << 3;

        v >>= shift; r |= shift;
        shift = if v > 0xF { 1 } else { 0 } << 2;
        v >>= shift; r |= shift;
        shift = if v > 0x3 { 1 } else { 0 } << 1;
        v >>= shift; r |= shift;

        r | (v >> 1)
    }

    /// Handy function for batch renderers: copies bound textures in first Self::MAX_TEXTURES locations to array
    /// sets actual batch_location for them.
    fn copy_bound_textures(arr: &mut Vec<&BaseTexture>, texture_system: &TextureSystem) {
        for i in (0..Self::MAX_TEXTURES).rev() {
            arr[i as usize] = texture_system.bound_textures[i as usize]; // || null
            
            if arr[i as usize].is_some() {
                arr[i as usize].batch_location = i;
            }
        }
    }

    /// All textures in texArray should have `batch_enabled = batch_id`,
    /// and their count should be less than `Self::MAX_TEXTURES`.
    fn bound_array(texArray: &BatchTextureArray, bound_textures: &Vec<&BaseTexture>, batch_id: u16) {
        let elements = &texArray.elements;
        let ids = &texArray.ids;
        let count = &texArray.count;

        let j = 0;

        for  i in 0..*count {
            let tex = elements[i as usize];
            let loc = tex.batch_location;

            if loc >= 0 && loc < (Self::MAX_TEXTURES as u16) && bound_textures[loc as usize] == tex {
                ids[i as usize] = loc;
                continue;
            }

            while j < Self::MAX_TEXTURES {
                let bound = bound_textures[j as usize];

                if bound.batch_enabled == batch_id && bound.batch_location == j {
                    j += 1;
                    continue;
                }

                ids[i as usize] = j as u16;
                tex.batch_location = j as u16;
                bound_textures[j as usize] = tex;
                break;
            }
        }
    }

    fn pack_interleaved_geometry(&self, batchable: Batchable<'s>)
    {
        let element = if let Batchable::Sprite(sprite) = batchable { sprite } else { return; };

        // TODO Change these to references instead.
        let uint32View = self.attribute_buffer.unwrap().uint32_view();
        let float32View = self.attribute_buffer.unwrap().float32_view();

        let packed_vertices = (self.a_index / self.vertex_size) as u16;
        let indicies = element.indices;
        let vertexData = &element.vertex;
        // let textureId = element.texture.base.batch_location;

        // let alpha = std::cmp::min(1.0/*element.worldAlpha*/, 1.0);
        let alpha = 1.0; // TODO use alpha param
        let argb = if (alpha < 1.0
            /*&& element.texture.base.alphaMode*/)
            { premultiply_tint(element.tint_rgb, alpha) } else
            { element.tint_rgb + (((alpha * 255.0) as u16) << 24) };

        // lets not worry about tint! for now..
        for i in (0..vertexData.len()).step_by(2) {
            float32View.set_index(self.a_index, vertexData[i]);
            self.a_index += 1;
            float32View.set_index(self.a_index, vertexData[i + 1]);
            self.a_index += 1;
            // float32View.set_index(self.a_index, element.uvs[i]);
            // self.a_index += 1; // TODO Remove this increment + uvs?
            // float32View.set_index(self.a_index, element.uvs[i + 1]);
            // self.a_index += 1; // TODO Remove this increment + uvs?
            uint32View.set_index(self.a_index, argb as u32);
            self.a_index += 1;
            // float32View[self.a_index] = textureId;
            // self.a_index += 1;
        }

        for i in 0..indicies.len() {
            let index_buffer = self.index_buffer.unwrap();
            self.i_buffers[index_buffer].unwrap().set_index(self.i_index, packed_vertices + indicies[i as usize]);
            self.i_index += 1;
        }
    }

    // Bind textures for current rendering
    fn bind_and_clear_tex_array(texArray: &mut BatchTextureArray, renderer: &Renderer) {
        for j in 0..texArray.count {
            renderer.texture_system.bind(texArray.elements[j as usize], texArray.ids[j as usize]);
        }

        texArray.elements.clear();
        texArray.count = 0;
    }
}

struct BatchTextureArray<'t> {
    pub elements: Vec<&'t BaseTexture>,
    pub ids: Vec<u16>,
    pub count: u16,
}

impl<'t> BatchTextureArray<'t> {
    pub fn new() -> BatchTextureArray<'t> {
        BatchTextureArray {
            elements: vec![],
            ids: vec![],
            count: 0
        }
    }
}

struct BatchDrawllCall<'a> {
    pub tex_array: Option<BatchTextureArray<'a>>,
    // pub type: DRAW_MODES,
    // pub blend: BLEND_MODES,
    pub start: u32,
    pub size: u32,
    pub data: Option<Box<Any>>,
}

impl<'a> BatchDrawllCall<'a> {
    pub fn new() -> BatchDrawllCall<'a> {
        BatchDrawllCall {
            tex_array: None,
            start: 0,
            size: 0,
            data: None,
        }
    }
}

/// Premultiply tint.
fn premultiply_tint(tint: u16, alpha: f32) -> u16 {
    if alpha == 1.0 {
        return (255 << 24) + tint;
    }

    if alpha == 0.0 {
        return 0;
    }

    let R: u16 = (tint >> 16) & 0xFF;
    let G: u16 = (tint >> 8) & 0xFF;
    let B: u16 = tint & 0xFF;

    R = (((R as f32 * alpha) + 0.5) as u16) | 0;
    G = (((G as f32 * alpha) + 0.5) as u16) | 0;
    B = (((B as f32 * alpha) + 0.5) as u16) | 0;

    return (((alpha * 255.0) as u16) << 24) + (R << 16) + (G << 8) + B;
}