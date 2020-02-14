import { Entity, Entities } from "./Entity";
import { Component } from "./Component";
import { System, Components } from "./System";

export class Ecs {

    public entities: Entities = {};
    public systems: System[] = [];

    public get entityCount(): number {
        return Object.keys(this.entities).length;
    }

    /**
     * Handles errors when registering an entity in a system.
     */
    private registerEntity(system: System, entity: Entity, components: Component[]): boolean {
        try {
            system.registerEntity(entity, components);
        } catch (error) {
            return false;
        }

        return true;
    }

    public createEntity(components: Component[]): Entity {
        const entity = this.entityCount;
        this.entities[entity] = components;

        components.forEach(component => {
            component.entity = entity;
        });

        // Register entity in all systems.
        this.systems.forEach(system => this.registerEntity(system, entity, components));

        return entity;
    }

    public addSystem(system: System): Entity {
        const systemId = this.systems.length;

        // Register all entities.
        Object.keys(this.entities).forEach(key => {
            const entity: Entity = parseInt(key);
            this.registerEntity(system, entity, this.entities[entity]);
        });

        this.systems.push(system);
        return systemId;
    }

    public loop(dt: number): void {
        this.systems.forEach(system => {
            system.loop(dt);
        });
    }
}
