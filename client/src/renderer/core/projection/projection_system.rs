use crate::renderer::Renderer;
use engine::nalgebra::*;
use engine::types::Rectangle;

/// System to manage the projection matrix.
/* 
   | a | c | tx|
   | b | d | ty|
   | 0 | 0 | 1 |
*/
pub struct ProjectionSystem {
    destination_frame: Rectangle,
    source_frame: Rectangle,
    default_frame: Rectangle,
    projection_matrix: Matrix3<f32>,
    transform: Option<Matrix3<f32>>,
}

impl Default for ProjectionSystem {
    fn default() -> ProjectionSystem {
        ProjectionSystem {
            destination_frame: Default::default(),
            source_frame: Default::default(),
            default_frame: Default::default(),
            projection_matrix: ProjectionSystem::new_matrix(1.0, 0.0, 0.0, 1.0, 0.0, 0.0),
            transform: Option::None,
        }
    }
}

impl ProjectionSystem {
    pub fn update(
        &mut self,
        /*renderer: &Renderer,*/
        destination_frame: &Rectangle,
        source_frame: &Rectangle,
        resolution: f32,
        root: bool)
    {
        self.destination_frame = destination_frame.clone();
        self.source_frame = source_frame.clone();

        self.calculate_projection(destination_frame, source_frame, resolution, root);

        if self.transform.is_some() {
            self.projection_matrix = ProjectionSystem::append_matrix(self.projection_matrix, self.transform.unwrap());
        }

        // TODO?
        // renderer.global_uniforms.uniforms.projection_matrix = self.projection_matrix;
        // renderer.global_uniforms.update();

        // if renderer.shader.shader.is_some() {
            // renderer.shader.sync_uniform_group(renderer.shader.shader.uniforms.globals);
        // }
    }

    pub fn calculate_projection(&mut self, destination_frame: &Rectangle, source_frame: &Rectangle, resolution: f32, root: bool) {
        let mut pm = self.projection_matrix;
        let sign = if !root { 1.0 } else { -1.0 };

        pm[(0,0)] = (1.0 / self.default_frame.size.x * 2.0) * resolution;
        pm[(1,1)] = sign * (1.0 / self.default_frame.size.y * 2.0) * resolution;

        pm[(0,2)] = -1.0 - (self.source_frame.position.x * pm[(0,0)]);
        pm[(1,2)] = -sign - (self.source_frame.position.y * pm[(1,1)]);
    }

    pub fn append_matrix(ma: Matrix3<f32>, mb: Matrix3<f32>) -> Matrix3<f32> {
        let a = (mb[(0,0)] * ma[(0,0)]) + (mb[(1,0)] * ma[(0,1)]);
        let b = (mb[(0,0)] * ma[(1,0)]) + (mb[(1,0)] * ma[(1,1)]);
        let c = (mb[(0,1)] * ma[(0,0)]) + (mb[(1,1)] * ma[(0,1)]);
        let d = (mb[(0,1)] * ma[(1,0)]) + (mb[(1,1)] * ma[(1,1)]);

        let tx = (mb[(0,2)] * ma[(0,0)]) + (mb[(1,2)] * ma[(0,1)]) + ma[(0,2)];
        let ty = (mb[(0,2)] * ma[(1,0)]) + (mb[(1,2)] * ma[(1,1)]) + ma[(1,2)];

        ProjectionSystem::new_matrix(a, b, c, d, tx, ty)
    }

    pub fn new_matrix(a: f32, b: f32, c: f32, d: f32, tx: f32, ty:f32) -> Matrix3<f32> {
        Matrix3::new(
            a, c, tx,
            b, d, ty,
            0.0, 0.0, 1.0
        )
    }
}