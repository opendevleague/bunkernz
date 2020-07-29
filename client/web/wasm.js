﻿
class Wasm {
    
    constructor() {
        this.importObject = null;
        this.plugins = null;
        this.exports = null;
        this.memory = null;
        this.listeners = {};
    }
    
    on(key, callback) {
        if (this.listeners[key] == null)
            this.listeners[key] = [];
        
        this.listeners[key].push(callback);
    }
    
    emit(key) {
        if (this.listeners[key] == null)
            return;
        
        this.listeners[key].forEach((callback) => {
            callback();
        });
    }
    
    load(path) {
        this.importObject = {
            env: {...(window.wasmImports ?? {})}
        };
        
        const request = fetch(path);
        
        if (typeof WebAssembly.instantiateStreaming === "function") {
            WebAssembly.instantiateStreaming(request, this.importObject)
                .then(this.initialiseObject.bind(this));
            return;
        }

        request
            .then((x) => {
                return x.arrayBuffer();
            })
            .then((bytes) => {
                return WebAssembly.instantiate(bytes, this.importObject);
            })
            .then(this.initialiseObject.bind(this));
    }
    
    initialiseObject(object) {
        this.memory = object.instance.exports.memory;
        this.exports = object.instance.exports;

        this.emit("load");
        object.instance.exports.main();
    }
    
}

window.wasm = new Wasm();