import { Component } from ".";

export interface Components {
    [id: string]: Component
}

export interface Entities<TComponents extends Components> {
    [id: number]: TComponents
}

export class System<TComponents extends Components> {

    /**
     * Global component reference array.
     */
    private readonly globalComponents: Component[];
    /**
     * System's entity-component dicionary.
     */
    private readonly entities: Entities<TComponents> = {};
    /**
     * System's component type reference array.
     */
    private readonly systemComponents: TComponents;

    public constructor(systemComponents: TComponents, globalComponents: Component[]) {
        this.globalComponents = globalComponents;
        this.systemComponents = systemComponents;
    }

    public addEntity(entity: number) {
        if (this.entities[entity] != null)
            return;

        const components: TComponents = {} as TComponents;

        // Make sure entity has required components; retrieve components.
        this.globalComponents.forEach(globalComponent => {
            Object.keys(this.systemComponents).forEach(key => {
                const systemComponent = this.systemComponents[key];

                if (globalComponent.constructor !== systemComponent.constructor)
                    return;

                const componentName: string = globalComponent.constructor.name.toLowerCase();
                //@ts-ignore
                components[componentName] = globalComponent;
            });
        });

        if (Object.keys(components).length < Object.keys(this.systemComponents).length)
            throw new Error(`Entity ${entity} does not have all required components by system "${this.constructor.name}"`)

        this.entities[entity] = components;
        this.start(components);
    }

    public removeEntity(entity: number) {
        const components: TComponents = this.entities[entity];

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
    protected start(components: TComponents) { }

    /**
     * Called when the system stops.
     */
    protected stop(components: TComponents) { }

    /**
     * Called once every frame.
     * @param dt 
     */
    protected update(components: TComponents, dt: number) { }
}