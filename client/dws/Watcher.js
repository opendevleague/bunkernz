const fs = require("fs");
const path = require("path");

/**
 * Watches multiple files and copies them to a target folder whenever changes are detected.
 */
class Watcher {

    constructor(config) {
        if (config == null || !config.enabled)
            return;
        
        this.config = config;
        this.copyFunctions = {};
        this.config.copy.forEach(this.registerFiles.bind(this));
    }
    
    registerFiles(copy) {
        copy.files.forEach((fileName) => {
            this.registerFile(copy.from, copy.to, fileName);
        });
    }

    registerFile(from, to, fileName) {
        const file = path.resolve(from, fileName);
        const destination = path.resolve(to, fileName);
        this.copyFunctions[file] = () => {
            fs.copyFile(file, destination, () => { });
        };
        
        fs.watch(file, () => {
            if (this.config.alwaysCopyAll) {
                this.copyAll();
                return;
            }
            
            this.copyFunctions[file]();
        });
    }
    
    copyAll() {
        for (let key in this.copyFunctions) {
            this.copyFunctions[key]();
        }
    }

}

module.exports = Watcher;