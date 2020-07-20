use oxid::*;
use engine::legion::prelude::*;
use crate::components::*;

pub fn add_player() -> Box<fn(&mut World, &mut Resources)> {
    Box::new(|world: &mut World, _resources: &mut Resources| {
        <Read<Pos>>::query()
            .filter(tag::<AddPlayer>())
            .iter_entities(world)
            .map(|entity| entity.0)
            .collect::<Vec<Entity>>()
            .iter()
            .for_each(|entity| {
                insert_new_player(world);
                world.delete(*entity);
            });
    })
}

pub fn insert_new_player(world: &mut World) -> Entity {
    info!("Adding new player");
    world.insert(
        (),
        vec![(
            Id(1),
            Pos(0.,0.,0.),
            Vel(0.,0.,0.),
            Input(0.,0.),
            RenderCircle {
                radius: 15.
            }
        )],
    ).to_vec()[0]
}