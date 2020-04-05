export default {
    server: {
        listenHost: "0.0.0.0",
        listenPort: 9001,
    },
    client: {
        server: "ws://localhost:9001",
        devServer: {
            host: "localhost",
            port: 9000,
            publicPath: '/assets'
        },
    },
};
