use engine::types::*;
use engine::*;
use nalgebra::*;
use crate::renderer::display::{
    DisplayContainer,
    Renderable
};
use crate::renderer::core::{
    Renderer,
    textures::Texture,
    batch::Batchable
};

pub struct Sprite {
    pub dc: DisplayContainer,
    pub indices: Vec<u16>,
    pub vertex: Vec<f32>,
    pub texture: Box<Texture>,
    pub anchor: nalgebra::Vector2<f32>,
}

impl Renderable for Sprite {
    fn render<'r>(&'r mut self, renderer: &mut Renderer<'_, 'r>) {
        if !self.dc.visible {
            return;
        }

        // TODO: Implement mask/filters?
        self.calculate_vertices();
        let batchable = Batchable::Sprite(self);
        renderer.batch.render(&renderer.ctx, batchable);
        // TOOD: Render children.
    }
}

impl Sprite {
    pub fn from(texture: Texture) -> Sprite {
        Sprite {
            dc: DisplayContainer::new(texture.base.width, texture.base.height),
            anchor: Vector2::new(0.5, 0.5),
            texture: Box::new(texture),
            indices: vec![],
            vertex: vec![],
        }
    }

    pub fn destroy(&mut self) { }

    pub fn set_width(&mut self, width: f32) {
        self.dc.width = width;
    }

    pub fn set_height(&mut self, height: f32) {
        self.dc.height = height;
    }

    fn calculate_vertices(&mut self) {
        // const texture = this._texture;

        // if (this._transformID === this.transform._worldID && this._textureID === texture._updateID)
        // {
        //     return;
        // }

        // // update texture UV here, because base texture can be changed without calling `_onTextureUpdate`
        // if (this._textureID !== texture._updateID)
        // {
        //     this.uvs = this._texture._uvs.uvsFloat32;
        // }

        // this._transformID = this.transform._worldID;
        // this._textureID = texture._updateID;

        // // set the vertex data

        // const wt = this.transform.worldTransform;
        // const a = wt.a;
        // const b = wt.b;
        // const c = wt.c;
        // const d = wt.d;
        // const tx = wt.tx;
        // const ty = wt.ty;
        // const vertexData = this.vertexData;
        // const trim = texture.trim;
        // const orig = texture.orig;
        // const anchor = this._anchor;

        // let w0 = 0;
        // let w1 = 0;
        // let h0 = 0;
        // let h1 = 0;

        // if (trim)
        // {
        //     // if the sprite is trimmed and is not a tilingsprite then we need to add the extra
        //     // space before transforming the sprite coords.
        //     w1 = trim.x - (anchor._x * orig.width);
        //     w0 = w1 + trim.width;

        //     h1 = trim.y - (anchor._y * orig.height);
        //     h0 = h1 + trim.height;
        // }
        // else
        // {
        //     w1 = -anchor._x * orig.width;
        //     w0 = w1 + orig.width;

        //     h1 = -anchor._y * orig.height;
        //     h0 = h1 + orig.height;
        // }

        // // xy
        // vertexData[0] = (a * w1) + (c * h1) + tx;
        // vertexData[1] = (d * h1) + (b * w1) + ty;

        // // xy
        // vertexData[2] = (a * w0) + (c * h1) + tx;
        // vertexData[3] = (d * h1) + (b * w0) + ty;

        // // xy
        // vertexData[4] = (a * w0) + (c * h0) + tx;
        // vertexData[5] = (d * h0) + (b * w0) + ty;

        // // xy
        // vertexData[6] = (a * w1) + (c * h0) + tx;
        // vertexData[7] = (d * h0) + (b * w1) + ty;

        // if (this._roundPixels)
        // {
        //     const resolution = settings.RESOLUTION;

        //     for (let i = 0; i < vertexData.length; ++i)
        //     {
        //         vertexData[i] = Math.round((vertexData[i] * resolution | 0) / resolution);
        //     }
        // }
    }
}
