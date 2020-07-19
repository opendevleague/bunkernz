#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Pos(pub f32, pub f32, pub f32);

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Vel(pub f32, pub f32, pub f32);

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct RenderCircle {
    pub radius: f32,
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct LocalInput(pub f32, pub f32);

#[derive(Copy, Clone, Debug, Eq, PartialEq, Hash)]
pub struct AddPlayer;

#[derive(Copy, Clone, Debug, Eq, PartialEq, Hash)]
pub struct LocalPlayer;