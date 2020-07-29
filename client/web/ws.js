window.ws = new WebSocket("ws://127.0.0.1:3000");
window.ws.binaryType = "arraybuffer";

let incoming_buffer_ptr;
let outgoing_buffer_ptr;
let opened_status = 0;
let wasm_loaded;

window.ws.onclose = () => {
    if (!wasm_loaded) {
        opened_status = 2;
        return;
    }

    wasm.exports.ws_on_close();
};

window.ws.onopen = () => {
    if (!wasm_loaded) {
        opened_status = 1;
        return;
    }
    
    wasm.exports.ws_on_open();
};

window.ws.onmessage = ({ data }) => {
    if (!wasm_loaded)
        return;

    if (incoming_buffer_ptr == null) {
        console.log(
            "Incoming stream buffer pointer was not initialised, cannot process data",
            data
        );
        return;
    }
    
    console.log("recived");
    
    data = new Uint8Array(data);
    const u8 = new Uint8Array(wasm.memory.buffer, incoming_buffer_ptr, data.length);
    // Write data to WASM memory.
    for (let i = 0; i < data.length; i++) {
        u8[i] = data[i];
    }
    // Inform WASM of the data length.
    wasm.exports.ws_on_receive(data.length);  
};

window.wasm.on("load", () => {
    console.log("Loaded WASM");
    wasm_loaded = true;
    
    if (opened_status == 1) {
        wasm.exports.ws_on_open();
    } else if (opened_status == 2) {
        wasm.exports.ws_on_open();
        wasm.exports.ws_on_close();
    }
    
    opened_status = 0;
});

window.wasmImports = {
    ...window.wasmImports,
    ws_send: function(ptr, length) {
        const array = new Uint8Array(wasm.memory.buffer, outgoing_buffer_ptr, length);
        outgoing_buffer_ptr = ptr;
        window.ws.send(array);
    },
    ws_initialise: function(ptr) {
        incoming_buffer_ptr = ptr;
    },
    memory: WebAssembly.Memory,
};