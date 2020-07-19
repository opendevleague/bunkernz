window.ws = new WebSocket("ws://127.0.0.1:3000");

setTimeout(() => {
    ws.onmessage = wasm.importObject.env.ws_receive;
}, 100);

window.wasmImports = {
    ...window.wasmImports,
    ws_send: function(ptr) {
        window.ws.send(UTF8ToString(ptr));
    },
    ws_receive: function({ data }) {
        var len = data.length;
        var msg = wasm.exports.allocate_vec_u8(len);
        var heap = new Uint8Array(wasm.memory.buffer, msg, len);
        stringToUTF8(data, heap, 0, len);
        wasm.exports.ws_receive(msg, len);
    },
};
