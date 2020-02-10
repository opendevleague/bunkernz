import { System, Component } from ".";

export class Entity {

    private constructor() { }

    private static getdEntityId(globalComponents: Component[]) {
        const idsFound: number[] = [];
        let id = 1;

        globalComponents.forEach(component => {
            if (idsFound.includes(component.entity))
                return;

            idsFound.push(component.entity);
            id++;
        });

        return id;
    }

    public static create(entityComponents: Component[], globalComponents: Component[]): number {
        const id: number = Entity.getdEntityId(globalComponents);

        entityComponents.forEach(component => {
            component.entity = id;
            globalComponents.push(component);
        });

        return id;
    }

    public static getComponents(entity: number, globalComponents: Component[]): Component[] {
        const components: Component[] = [];

        // Fetch entity components.
        globalComponents.forEach(component => {
            if (component.entity !== entity)
                return;

            components.push(component);
        });

        return components;
    }
}