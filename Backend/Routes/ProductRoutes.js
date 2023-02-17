import express from "express";
import Product from "../models/ProductModel.js";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  const result = await Product.find({});
  res.send(result);
});

productRouter.get("/:id", async(req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product not found" });
  }
});

export default productRouter;
