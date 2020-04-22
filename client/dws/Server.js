const path = require("path");
const express = require("express");

class Server {

    constructor(config) {
        if (config == null || !config.enabled)
            return;
        
        this.config = config;
        this.initialise();
    }

    initialise() {
        this.app = express();
        this.app.use(express.static(this.config.path));

        this.app.get("/", (request, response) => {
            response.sendFile(path.resolve(this.config.path, "index.html"));
        });

        this.app.listen(this.config.port, () => {
            console.log(`Listening on port ${this.config.port}`);
        });
    }

}

module.exports = Server;