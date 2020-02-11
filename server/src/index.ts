import Engine from "../../shared/Engine";
import NetworkServer from "./systems/NetworkServer";

const engine = new Engine();

engine.addSystem(new NetworkServer());

engine.run();
