export function setCallback(callback) {
    window.onresize = (event) => {
        callback(window.innerWidth, window.innerHeight);
    }
}