use std::any::Any;
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
    size: i32,
    // shader_generator: ShaderGenerator,
    vertex_size: i32,
    vertex_count: i32,
    index_count: usize,
    buffered_elements: Vec<&'s Sprite>,
    buffered_textures: Vec<&'s BaseTexture>,
    buffer_size: usize,
    // shader: Shader,
    flush_id: i32,
    // a_buffers: Vec<ViewableBuffer>,
    i_buffers: Vec<Vec<u16>>,
    dc_index: usize, // not DisplayContainer
    a_index: usize,
    i_index: usize,
    // attribute_buffer: Vec<ViewableBuffer>,
    index_buffer: Vec<u16>,
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
            index_buffer: vec![],
            i_buffers: vec![],
        }
    }
}

impl<'s> BatchRenderer<'s> {
    // This currently only renders sprites.
    // Ideally the Batchable enum will be a trait.
    pub fn render(&mut self, batchable: Batchable<'s>) {
        let sprite = if let Batchable::Sprite(sprite) = batchable { sprite } else {
            return;
        };

        if !sprite.texture.is_valid {
            return;
        }

        let element_vertex_count = (sprite.vertex.len() as i32)/2;

        // Flush if the element count overflows the max vertex count allowed.
        if self.vertex_count + element_vertex_count > self.size {
            self.flush();
        }

        self.vertex_count += element_vertex_count;
        self.index_count += sprite.indices.len();
        self.buffered_textures[self.buffer_size] = &sprite.texture.base;
        self.buffered_elements[self.buffer_size] = &sprite;
    }

    fn flush(&mut self) {

    }
}