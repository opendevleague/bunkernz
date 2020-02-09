import "../style/index.scss";
import * as PIXI from 'pixi.js'

class Client {

    private root: HTMLDivElement = document.getElementById("root") as HTMLDivElement;
    private canvas: HTMLCanvasElement = document.getElementById("view") as HTMLCanvasElement;
    private app: PIXI.Application;

    public constructor() {
        this.app = new PIXI.Application({
            view: this.canvas,
            width: window.innerWidth,
            height: window.innerHeight,
            
            backgroundColor: 0x131313
        });

        this.windowEvents();

        const text = new PIXI.Text("community game prototype!");
        text.style.fill = 0xf0f0f0;
        text.x = (window.innerWidth/2) - (text.width/2);
        text.y = (window.innerHeight/2) - (text.height/2);

        this.app.stage.addChild(text);
    }

    private windowEvents() {
        window.addEventListener("resize", () => {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
        });
    }
}

const client = new Client();