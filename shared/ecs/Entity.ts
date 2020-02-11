import Component from "./Component";

export default class Entity {
    public components: Component[] = [];

    constructor(components: Component[]) {
        components.forEach(c => this.addComponent(c));
    }

    public getComponent<T extends typeof Component>(
        type: T,
    ): InstanceType<T> | undefined {
        return this.components.find(c => c instanceof type) as InstanceType<T>;
    }

    public addComponent(component: Component): void {
        this.components.push(component);
        component.entity = this;
    }
}
