import express from "express";
import Product from "../models/ProductModel.js";

const slugRouter = express.Router();
slugRouter.get("/", async (req, res) => {
  const products = await Product.find({});

  if (products) {
    const filteredOnlySlugs = products.map((item) => {
      return { slug: item.slug };
    });
    res.send(filteredOnlySlugs);
  } else {
    res.status(404).send({ message: "Slugs not found " });
  }
});

slugRouter.get("/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product not found " });
  }
});

export default slugRouter;
