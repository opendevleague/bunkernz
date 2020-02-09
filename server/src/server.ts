import express, { Application, Request, Response } from "express";

const app: Application = express();
const PORT: any = process.env.PORT || 3001;

app.use(express.json());



app.get("/", (req: Request, res: Response): void => {
  res.send("YAY!!");
});



app.listen(PORT, () => console.log(`Server is up and running on port: ${PORT}`))