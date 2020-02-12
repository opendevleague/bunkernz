import { Component } from ".";

export interface Components {
    [id: string]: Component
}

export interface SystemEntities {
    [id: number]: Components
}

export abstract class System {

    /**
     * System's entity-component dicionary.
     */
    private readonly entities: SystemEntities = {};
    /**
     * System's required components array.
     */
    private readonly requiredComponents: Components;

    public constructor(requiredComponents: Components) {
        this.requiredComponents = requiredComponents;
    }

    public registerEntity(entity: number, components: Component[]) {
        if (this.entities[entity] != null)
            return;

        const componentsToAdd: Components = {};

        Object.keys(this.requiredComponents).forEach(key => {
            const requiredComponent = this.requiredComponents[key];
            const componentName: string = requiredComponent.constructor.name.toLowerCase();
            const component = components.find(x => x.constructor.name.toLowerCase() === componentName);

            if (component == null)
                throw new Error(`Entity ${entity} does not have the required component "${requiredComponent.constructor.name}" by system "${this.constructor.name}"`);

            if (component.entity != entity)
                throw new Error("Component(s) from multiple entities passed to System.addEntity");

            // Abort if component does not belong to this sytem.
            if (this.requiredComponents[componentName] == null)
                return;

            // Add component to registered entity.
            componentsToAdd[componentName] = component;
        });

        this.entities[entity] = componentsToAdd;
        this.start(this.entities[entity]);
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