import { System, Component, Entity } from "./ecs";

export default class Engine {
    public systems: System[] = [];
    public components: Component[] = [];
    private componentMap: Map<string, Component[]> = new Map();
    private createdLastFrame: Component[] = [];
    private justCreated: Component[] = [];
    private disposedLastFrame: Component[] = [];
    private justDisposed: Component[] = [];

    public addSystem(system: System): void {
        this.systems.push(system);
    }

    public createEntity(components: Component[]): Entity {
        const entity = new Entity(components);

        this.justCreated = this.justCreated.concat(components);
        this.components = this.components.concat(components);
        components.forEach(component => {
            const type = component.constructor.name;

            if (!this.componentMap.has(type)) {
                this.componentMap.set(type, []);
            }

            this.componentMap.get(type)?.push(component);
        });

        return entity;
    }

    public dispose(object: Entity): void {
        const notDisposed = (c: Component): boolean => {
            return !object.components.includes(c);
        };

        this.components = this.components.filter(notDisposed);
        this.componentMap.forEach((list, type) => {
            this.componentMap.set(type, list.filter(notDisposed));
        });
        this.justDisposed = this.justDisposed.concat(object.components);
    }

    public run(): void {
        setInterval(() => {
            this.update();
        }, 1000 / 60);
    }

    public createdComponents(): Component[] {
        return this.createdLastFrame;
    }

    public disposedComponents(): Component[] {
        return this.disposedLastFrame;
    }

    public componentsOfType<T extends typeof Component>(
        type: T,
    ): InstanceType<T>[] {
        return (this.componentMap.get(type.name) as InstanceType<T>[]) || [];
    }

    private update(): void {
        this.systems.forEach(system => {
            system.update(this);
        });

        if (this.justCreated.length || this.createdLastFrame.length) {
            this.createdLastFrame = this.justCreated;
            this.justCreated = [];
        }

        if (this.justDisposed.length || this.disposedLastFrame.length) {
            this.disposedLastFrame = this.justDisposed;
            this.justDisposed = [];
        }
    }
}
