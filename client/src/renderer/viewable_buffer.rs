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

pub struct ViewableBuffer {
    pub size: u32,
    pub raw: ArrayBuffer,
}

impl ViewableBuffer {
    pub fn new(size: u32) -> ViewableBuffer {
        ViewableBuffer {
            size,
            raw: ArrayBuffer::new(size)
        }
    }

    pub fn uint16_view(&self) -> Uint16Array {
        Uint16Array::new(&self.raw)
    }

    pub fn uint32_view(&self) -> Uint32Array {
        Uint32Array::new(&self.raw)
    }

    pub fn float32_view(&self) -> Float32Array {
        Float32Array::new(&self.raw)
    }
}