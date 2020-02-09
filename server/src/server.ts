import express, { Application, Request, Response } from "express";
import path from "path";
import fs from "fs";
import util from "util";

const readDir = util.promisify(fs.readdir);
const fileStat = util.promisify(fs.stat);

class Server {
    
    private readonly app: Application = express();

    /**
     * @param directory The input directory.
     * @returns Array of all files and subfiles within the directory.
     */
    private static async getAllFolderFiles(directory: string): Promise<string[]> {
        let files = await  readDir(directory);

        let result: Promise<string[]>[] = Array.prototype.concat(...files.map(async file => {
            file = path.join(directory,file);
            const stat: fs.Stats = await fileStat(file);

            return stat.isDirectory() ? await Server.getAllFolderFiles(file) : [file]
        }));

        return Array.prototype.concat(...(await Promise.all(result)));
    }

    public constructor() {
        this.routing();
    }

    public start(port: number) {
        this.app.listen(port, () => console.log(`Server listening on 0.0.0.0:${port}`));
        return this;
    }

    private async routing() {
        // Configure app.
        this.app.use(express.json());

        // Static serving.
        const staticPath = path.join(__dirname, "../../client/dist");
        this.app.use(express.static(staticPath));

        // Import all API routes.
        const routesPath = path.join(__dirname, "routes");
        const routes: string[] = await Server.getAllFolderFiles(routesPath);
        routes.forEach((file) => {
            this.app.use(require(file));
        });
    }
}

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const server = new Server().start(port);