import express from "express";
import Container from "../classes/Container.js";
import { mariadb } from "../config.js";
//import upload from "../services/uploader.js";
import { authMiddleware } from "../utils.js";
import dotenv from "dotenv";
dotenv.config();

const productsService = new Container(mariadb, "products");
const router = express.Router();

/// GETS
router.get("/", (req, res) => {
  productsService.getProducts().then((result) => {
    res.send(result);
  });
});

router.get("/:pid", (req, res) => {
  let id = parseInt(req.params.pid);
  productsService.getProductById(id).then((result) => {
    if (result !== null) {
      res.send(result);
    } else {
      res.send({ error: "producto no encontrado" });
    }
  });
});

//POSTS
router.post("/insert", authMiddleware, (req, res) => {
  let product = req.body;
  console.log(product);
  if (!product.title)
    return res.send({ status: "error", message: "incompleted title tabled" });
  productsService.registerProduct(product).then((result) => {
    res.send(result);
  });
});

///
/*
router.post("/", authMiddleware, upload.single("thumbnail"), (req, res) => {
  const file = req.file;
  const product = req.body;
  product.thumbnail = `${req.protocol}://${req.hostname}:${process.env.PORT}/uploads/${file.filename}`;
  productsService.saveProduct(product).then((result) => {
    if (result.status === "success") res.status(200).json(result);
    else res.status(500).send(result);
  });
});
*/

/*--------------------------------------*/

//DELETEs
router.delete("/:pid", authMiddleware, (req, res) => {
  let id = parseInt(req.params.pid);
  productsService.deleteProduct(id).then((result) => {
    if (result !== null) {
      res.send(result);
    } else {
      res.send({ error: "Cant find product" });
    }
  });
});

//PUTs
router.put("/:pid", authMiddleware, (req, res) => {
  let body = req.body;
  let id = parseInt(req.params.pid);
  productsService.updateProduct(id, body).then((result) => {
    if (result.status === "success") res.status(200).json(result);
    else res.status(500).send(result);
  });
});

export default router;
