import { Entity, Entities } from "./Entity";
import { Component } from "./Component";
import { System, Components } from "./System";

export class Ecs {

    public entities: Entities = {};
    public systems: System[] = [];

    public get entity_count(): number {
        return Object.keys(this.entities).length;
    }

    public createEntity(components: Component[]): number {
        const entity = this.entity_count;
        this.entities[entity] = components;

        components.forEach(component => {
            component.entity = entity;
        });

        // Register entity in all systems.
        this.systems.forEach(system => {
            system.registerEntity(entity, components);
        });

        return entity;
    }

    public addSystem(system: System): number {
        const systemId = this.systems.length;

        // Register all entities.
        Object.keys(this.entities).forEach(key => {
            const entity: number = parseInt(key);
            system.registerEntity(entity, this.entities[entity]);
        });

        this.systems.push(system);
        return systemId;
    }

    public loop(dt: number) {
        this.systems.forEach(system => {
            system.loop(dt);
        });
    }
}