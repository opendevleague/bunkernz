import express, { Application, Request, Response } from "express";
import { Example } from "../../resources/Example";

const app = module.exports = express();

/**
 * Example route.
 */
app.get("/example", async (request, response, next) => {
    const example = new Example('hello, world!');
    response.send(example.log());
});