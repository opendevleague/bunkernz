import { Entity, Entities } from "./Entity";
import { Component } from "./Component";
import { System, Components } from "./System";

export class Ecs {

    private baseEntityId = 0;
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
        const entity = this.baseEntityId++;
        this.entities[entity] = components;

        components.forEach(component => {
            component.entity = entity;
        });

        // Register entity in all systems.
        this.systems.forEach(system => this.registerEntity(system, entity, components));

        return entity;
    }

    public removeEntity(entity: Entity): void {
        this.entities[entity].forEach(component => {
            this.removeComponent(entity, component);
        });

        delete this.entities[entity];
    }

    public removeComponent(entity: Entity, component: Component | typeof Component) {
        const componentName: string = component instanceof Component ? component.constructor.name.toLowerCase() : component.name.toLowerCase();
        const components = this.entities[entity];
        let componentIndex = -1;

        for (let i = 0; i < components.length; i++) {
            if (components[i].constructor.name.toLowerCase() !== componentName)
                continue;

            componentIndex = i;
            break;
        }

        if (componentIndex == -1)
            return;

        this.entities[entity][componentIndex].entity = -1;
        this.entities[entity].splice(componentIndex, 1);
        this.systems.forEach(system => system.validateEntity(entity));
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
