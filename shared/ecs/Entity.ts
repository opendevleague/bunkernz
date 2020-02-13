import { System, Component } from ".";

export type Entity = number;

export type Entities = {
    [id: number]: Component[];
};
