window.ws = new WebSocket("ws://127.0.0.1:3000");
window.ws.binaryType = "arraybuffer";

setTimeout(() => {
    ws.onmessage = wasm.importObject.env.ws_receive;
}, 100);

let ptr_cache;

window.wasmImports = {
    ...window.wasmImports,
    ws_send: function(ptr, length) {
        const array = new Uint8Array(wasm.memory.buffer, ptr, length);
        ptr_cache = ptr;
        window.ws.send(array);
    },
    ws_receive: function({ data }) {
        data = new Uint8Array(data);
        const u8 = new Uint8Array(wasm.memory.buffer, ptr_cache, data.length);
        // Write data to WASM memory.
        for (let i = 0; i < data.length; i++) {
            u8[i] = data[i];
        }
        // Inform WASM of the data length.
        wasm.exports.ws_receive(data.length);
    },
    memory: WebAssembly.Memory,
};