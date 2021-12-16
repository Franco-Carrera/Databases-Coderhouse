import express from "express";
import { engine } from "express-handlebars";
import cors from "cors";
import Container from "./classes/Container.js";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import { sqlite } from "./config.js";
import productsRouter from "./routes/products.js";
import dotenv from "dotenv";
dotenv.config();

const admin = true;
const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log("Listening on port: ", PORT);
});

//socket
const io = new Server(server);
const container = new Container(sqlite, "chats");

io.on("connection", (socket) => {
  console.log("Cliente conectado.");
  container.getMessages().then((result) => {
    if (result.status === "success") {
      io.emit("chats", result.payload);
    }
  });
  socket.on("chats", (data) => {
    container
      .saveMessage(data)
      .then((result) => console.log(result))
      .then(() => {
        container.getMessages().then((result) => {
          if (result.status === "success") {
            io.emit("chats", result.payload);
          }
        });
      });
  });
});
//--------- end socket ----------------//

//handlebars
app.engine("handlebars", engine());
/// dirección de  __dirname sacar
app.set("views", "./views");
app.set("view engine", "handlebars");
///middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(new Date().toTimeString().split(" ")[0], req.method, req.url);
  req.auth = admin;
  next();
});
app.use("/uploads/", express.static(__dirname + "/uploads"));
app.use(express.static(__dirname + "/public"));
app.use("/api/products", productsRouter);

app.use((req, res) => {
  res.render("index");
});

app.use("/*", (req, res) =>
  res.send({
    error: -2,
    description: `Path ${req.originalUrl} and method ${req.method} aren't implemented`,
  })
);
