import { Component, Entity } from ".";

export type Entities = {
    [id: number]: Component[]
}

export class System {

    /**
     * Global component reference array.
     */
    private readonly globalComponents: Component[];
    /**
     * System active component array.
     */
    private readonly components: Component[] = [];
    /**
     * System component type reference array.
     */
    private readonly systemComponents: Component[];


    /**
     * Active entities array.
     */
    public get entities(): number[] {
        const value: number[] = [];

        this.components.forEach(component => {
            if (value.includes(component.entity))
                return;

            value.push(component.entity);
        });

        return value;
    }

    public constructor(systemComponents: Component[], globalComponents: Component[]) {
        this.globalComponents = globalComponents;
        this.systemComponents = systemComponents;
    }

    public addEntity(entity: number) {
        if (this.entities[entity] != null)
            return;

        const components: Component[] = [];

        // Make sure entity has required components; retrieve components.
        this.globalComponents.forEach(globalComponent => {
            this.systemComponents.forEach(systemComponent => {
                if (globalComponent.constructor !== systemComponent.constructor)
                    return;

                components.push(globalComponent);
            });
        });

        if (components.length < this.systemComponents.length)
            throw new Error(`Entity ${entity} does not have all required components by system "${this.constructor.name}"`)

        components.forEach(component => {
            this.components.push(component);
        });

        this.start(components);
    }

    public removeEntity(entity: number) {
        const components: Component[] = Entity.getComponents(entity, this.globalComponents);

        this.stop(components);

        // Remove components.
        components.forEach(component => {
            const i = this.components.indexOf(component);
            this.components.splice(i, 1);
        });
    }

    /**
     * Called once every frame by the main game loop.
     * @param dt 
     */
    public loop(dt: number) {
        const entities = this.entities;
        //console.log("@ loop, entities: ", entities);

        this.entities.forEach(entity => {
            const components = Entity.getComponents(entity, this.globalComponents);
            this.update(components, dt);
        });
    }

    /**
     * Called when the system starts.
     */
    protected start(components: Component[]) { }

    /**
     * Called when the system stops.
     */
    protected stop(components: Component[]) { }

    /**
     * Called once every frame.
     * @param dt 
     */
    protected update(components: Component[], dt: number) { }
}