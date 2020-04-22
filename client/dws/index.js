const path = require("path");
const express = require("express");
const app = express();
const fs = require("fs");
const Watcher = require("./Watcher.js");
const Server = require("./Server.js");

const configPath = __dirname;
const config =  JSON.parse(fs.readFileSync(path.resolve(configPath, "config.json"), "utf8"));

if (config.server.enabled)
    startServer();

if (config.watcher.enabled)
    startWatcher();

function startServer() {
    config.server.folder = path.resolve(configPath, config.server.path);
    new Server(config.server);
}

function startWatcher() {
    for (let i = 0; i < config.watcher.copy.length; i++) {
        config.watcher.copy[i].from = path.resolve(configPath, config.watcher.copy[i].from);
        config.watcher.copy[i].to = path.resolve(configPath, config.watcher.copy[i].to);
    }
    
    new Watcher(config.watcher);
}