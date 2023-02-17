import express from "express";
import data from "../data.js";
import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";

const seederRoute = express.Router();

seederRoute.get("/", async (req, res) => {
  await Product.deleteMany({});
  await User.deleteMany({});

  const createdProducts = await Product.insertMany(data.products);
  const createdUsers = await User.insertMany(data.users);

  res.send({ createdProducts, createdUsers });
});

export default seederRoute;
