import Engine from "../Engine";

export default abstract class System {
    public update(engine: Engine): void {
        // To be overridden by derived classes
    }
}
