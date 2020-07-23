setlocal
rustup target add wasm32-unknown-unknown
cargo install cargo-watch
start "bunker.nz build slave" cargo watch -x "build --target wasm32-unknown-unknown"
cd /d %~dp0\dws
start "bunker.nz dev server" node index.js