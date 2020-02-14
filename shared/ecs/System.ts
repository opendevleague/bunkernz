import { Component } from "./Component";
import { Entity } from "./Entity";

export interface Components {
    [id: string]: Component;
}

export interface SystemEntities {
    [id: number]: Components;
}

export abstract class System {
    /**
     * System's entity-component dicionary.
     */
    protected readonly entities: SystemEntities = {};
    /**
     * System's required components array.
     */
    protected readonly requiredComponents: typeof Component[] = [];

    protected getComponent<T extends typeof Component>(entity: Entity, type: T): InstanceType<T> {
        const typeName = type.name.toLowerCase();

        return this.entities[entity][typeName] as InstanceType<T>;
    }

    public registerEntity(entity: Entity, components: Component[]): void {
        if (this.entities[entity] != null) return;

        const componentsToAdd: Components = {};

        this.requiredComponents.forEach(requiredComponent => {
            const componentName: string = requiredComponent.name.toLowerCase();
            const component = components.find(x => x.constructor.name === requiredComponent.name);

            if (component == null)
                throw new Error(`Entity ${entity} does not have the required component "${requiredComponent.name}" by system "${this.constructor.name}"`);

            if (component.entity != entity)
                throw new Error("Component(s) from multiple entities passed to System.addEntity");

            // Add component to registered entity.
            componentsToAdd[componentName] = component;
        });

        this.entities[entity] = componentsToAdd;
        this.start(entity);
    }

    public removeEntity(entity: number): void {
        this.stop(entity);
        delete this.entities[entity];
    }

    /**
     * Called once every frame by the main game loop.
     * @param dt
     */
    public loop(dt: number): void {
        Object.keys(this.entities).forEach(entity => {
            this.update(+entity, dt);
        });
    }

    /**
     * Called when the system starts.
     */
    protected start(entity: Entity): void {
        // Override
    }

    /**
     * Called when the system stops.
     */
    protected stop(entity: Entity): void {
        // Override
    }

    /**
     * Called once every frame.
     * @param dt
     */
    protected update(entity: Entity, dt: number): void {
        // Override
    }
}
