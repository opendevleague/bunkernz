import { Component, Entity } from ".";

export interface Entities {
    [id: number]: Components
}

export interface Components {
    [id: string]: Component
}

export class System {

    /**
     * Global component reference array.
     */
    private readonly globalComponents: Component[];
    /**
     * System's entity-component dicionary.
     */
    private readonly entities: Entities = {};
    /**
     * System's component type reference array.
     */
    private readonly systemComponents: Components;

    public constructor(systemComponents: Component[], globalComponents: Component[]) {
        this.globalComponents = globalComponents;
        this.systemComponents = {};

        systemComponents.forEach(component => {
            const componentName: string = component.constructor.name.toLowerCase();
            this.systemComponents[componentName] = component;
        });
    }

    public addEntity(entity: number) {
        if (this.entities[entity] != null)
            return;

        const components: Components = {};

        // Make sure entity has required components; retrieve components.
        this.globalComponents.forEach(globalComponent => {
            Object.keys(this.systemComponents).forEach(key => {
                const systemComponent = this.systemComponents[key];

                if (globalComponent.constructor !== systemComponent.constructor)
                    return;

                const componentName: string = globalComponent.constructor.name.toLowerCase();
                components[componentName] = globalComponent;
            });
        });

        if (Object.keys(components).length < Object.keys(this.systemComponents).length)
            throw new Error(`Entity ${entity} does not have all required components by system "${this.constructor.name}"`)

        this.entities[entity] = components;
        this.start(components);
    }

    public removeEntity(entity: number) {
        const components: Components = this.entities[entity];

        if (components == null)
            return;

        this.stop(components);
        delete this.entities[entity];
    }

    /**
     * Called once every frame by the main game loop.
     * @param dt 
     */
    public loop(dt: number) {
        Object.keys(this.entities).forEach(key => {
            const components = this.entities[parseInt(key)];
            this.update(components, dt);
        });
    }

    /**
     * Called when the system starts.
     */
    protected start(components: Components) { }

    /**
     * Called when the system stops.
     */
    protected stop(components: Components) { }

    /**
     * Called once every frame.
     * @param dt 
     */
    protected update(components: Components, dt: number) { }
}