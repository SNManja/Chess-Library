import cors from "cors";
import express, { Request, Response } from "express";
import { Server } from "socket.io";
import { frontendPath } from "./paths";

const app = express();
const port = 8080;
const io = new Server();


app.use(cors({
    origin: "http://127.0.0.1:8080", // Reemplaza con la URL de tu frontend
}));


app.set("views", `${frontendPath}`)

app.use(express.static("frontend"));
app.use(express.static("node_modules"));

app.get('/', (req : Request, res : Response) => {
    res.sendFile(frontendPath  + "/index.html");
})

io.on("connection", async (socket) => {
    // normalmente checkearia el id de partida en la base de datos de partidas
    console.log("User connected")

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})






app.listen(port)
