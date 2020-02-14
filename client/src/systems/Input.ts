import { System, Component, Entity } from "../../../shared/ecs";
import ActionMap from "../components/ActionMap";

// export default class Input extends System {

//     private listeners: Record<string, Array<() => void>> = {};

//     public constructor(actions: Record<string, string>) {
//         super();

//         Object.entries(actions).forEach(([name, key]) => {
//             this.listeners[name] = [];

//             document.addEventListener("keydown", ev => {
//                 if (ev.key === key) {
//                     this.listeners[name].forEach(callback => callback());
//                 }
//             });
//         });
//     }

//     public update(engine: Engine): void {
//         engine.createdComponents().forEach(component => {
//             if (component instanceof ActionMap && component.entity) {
//                 const entity = component.entity;

//                 Object.entries(component.map).forEach(([name, callback]) => {
//                     this.listeners[name].push(callback.bind(component, entity));
//                 });
//             }
//         });
//     }
// }
