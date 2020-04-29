use std::{
    any::Any,
    cell::RefCell
};
use web_sys::WebGlRenderingContext;
use crate::renderer::{
    core:: {
        webgl::State,
        textures::BaseTexture
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
    vertex_size: usize,
    vertex_count: usize,
    index_count: usize,
    buffered_elements: Vec<Option<&'s Sprite>>,
    buffered_textures: Vec<&'s BaseTexture>,
    buffer_size: usize,
    // shader: Shader,
    flush_id: i32,
    // a_buffers: Vec<ViewableBuffer>,
    i_buffers: Vec<Option<Vec<u16>>>,
    dc_index: usize, // not DisplayContainer
    a_index: usize,
    i_index: usize,
    // attribute_buffer: Vec<ViewableBuffer>,
    /// Pointer index to current buffer.
    index_buffer: Option<usize>,
    temp_bound_textures: Vec<&'s BaseTexture>
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
            buffered_elements: vec![],
            buffered_textures: vec![],
            temp_bound_textures: vec![],
            index_buffer: None,
            i_buffers: vec![],
        }
    }
}

impl<'s> BatchRenderer<'s> {
    // This currently only renders sprites.
    // Ideally the Batchable enum will be a trait.
    pub fn render(&mut self, ctx: &RefCell<WebGlRenderingContext>, batchable: Batchable<'s>) {
        let sprite = if let Batchable::Sprite(sprite) = batchable { sprite } else {
            return;
        };

        if !sprite.texture.is_valid {
            return;
        }

        let element_vertex_count = sprite.vertex.len()/2;

        // Flush if the element count overflows the max vertex count allowed.
        if self.vertex_count + element_vertex_count > self.size {
            self.flush(ctx);
        }

        self.vertex_count += element_vertex_count;
        self.index_count += sprite.indices.len();
        self.buffered_textures[self.buffer_size] = &sprite.texture.base;
        self.buffered_elements[self.buffer_size] = Some(&sprite);

        // TODO remove this
        self.flush(ctx);
    }

    fn flush(&mut self, ctx: &RefCell<WebGlRenderingContext>) {
        if self.vertex_count == 0 {
            return;
        }

        // this._attributeBuffer = this.getAttributeBuffer(this._vertexCount);
        self.index_buffer = Some(self.get_index_buffer(self.index_count));
        self.a_index = 0;
        self.i_index = 0;
        self.dc_index = 0;

        self.build_textures_and_draw_calls();
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
            self.i_buffers[rounded_size_index] = Some(vec![]);
        }

        rounded_size_index
    }

    fn build_textures_and_draw_calls(&mut self) {
        let textureArrays = Self::texture_array_pool;
        let boundTextures = self._tempBoundTextures;
        let touch = self.renderer.textureGC.count;

        let TICK = ++BaseTexture._globalBatch;
        let countTexArrays = 0;
        let texArray = textureArrays[0];
        let start = 0;

        Self::copyBoundTextures(boundTextures, MAX_TEXTURES);

        for i in 0..self.buffer_size {
            const tex = self.buffered_textures[i];

            self.buffered_textures[i] = null;
            if tex._batchEnabled === TICK {
                continue;
            }

            if texArray.count >= MAX_TEXTURES {
                Self::boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
                this.buildDrawCalls(texArray, start, i);
                start = i;
                texArray = textureArrays[++countTexArrays];
                ++TICK;
            }

            tex._batchEnabled = TICK;
            tex.touched = touch;
            texArray.elements[texArray.count++] = tex;
        }

        if texArray.count > 0 {
            Self::boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
            this.buildDrawCalls(texArray, start, this._bufferSize);
            ++countTexArrays;
            ++TICK;
        }

        for let i = 0; i < boundTextures.length; i++ {
            boundTextures[i] = nul;l
        }

        BaseTexture._globalBatch = TICK;
    }

    fn buildDrawCalls(&mut self, texture_array: BatchTextureArray, start: usize, finish: usize) {
        let draw_calls = Self::draw_call_pool;
        let draw_call = draw_calls[self.dc_index];

        draw_call.start = self.i_index;
        draw_call.texture_array = texture_array;

        for i in start..finish {
            let sprite = self.buffered_elements[i];
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
                draw_call.texture_array = texture_array;
                draw_call.start = self.i_index;
            }

            self.packInterleavedGeometry(sprite, _attributeBuffer, _indexBuffer, self.a_index, self.i_index);
            self.a_index += sprite.vertex.len() / 2 * self.vertex_size;
            self.i_index += sprite.indices.len();

            // draw_call.blend = sprite_blend_mode;
        }

        if start < finish {
            draw_call.size = self.i_index - draw_call.start;
            self.dc_index += 1;
        }
    }

    fn draw_batches(&mut self, ctx: &RefCell<WebGlRenderingContext>) {
        let state = state_system;
        let draw_calls = Self::draw_call_pool;
        let curTexArray = null;

        // Upload textures and do the draw calls
        for i in 0..self.dc_index {
            let { texArray, type, size, start, blend } = drawCalls[i];

            if curTexArray != texArray {
                curTexArray = texArray;
                this.bindAndClearTexArray(texArray);
            }

            this.state.blendMode = blend;
            stateSystem.set(this.state);
            ctx.draw_elements(type, size, gl.UNSIGNED_SHORT, start * 2);
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

    /// Handy function for batch renderers: copies bound textures in first max_textures locations to array
    /// sets actual batch_location for them.
    fn copyBoundTextures(arr: BaseTexture[], max_textures: i32) {
        const { boundTextures } = this.renderer.texture;

        for (let i = max_textures - 1; i >= 0; --i)
        {
            arr[i] = boundTextures[i] || null;
            if (arr[i])
            {
                arr[i].batch_location = i;
            }
        }
    }

    /// All textures in texArray should have `batch_enabled = batch_id`,
    /// and their count should be less than `max_textures`.
    fn boundArray(texArray: BatchTextureArray, boundTextures: Array<BaseTexture>,
        batchId: usize, max_textures: usize)
    {
        let { elements, ids, count } = texArray;
        let j = 0;

        for (let i = 0; i < count; i++) {
            const tex = elements[i];
            const loc = tex._batchLocation;

            if loc >= 0 && loc < max_textures && boundTextures[loc] == tex {
                ids[i] = loc;
                continue;
            }

            while j < max_textures {
                const bound = boundTextures[j];

                if bound && bound._batchEnabled == batchId && bound._batchLocation == j {
                    j += 1;
                    continue;
                }

                ids[i] = j;
                tex._batchLocation = j;
                boundTextures[j] = tex;
                break;
            }
        }
    }
}