
pub struct State {
    data: i32,
    polygon_offset: i32,
}

impl Default for State {
    fn default() -> State {
        State {
            data: 0,
            polygon_offset: 0,
        }
    }
}