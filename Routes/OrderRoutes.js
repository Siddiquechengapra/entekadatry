import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/OrderModel.js";
import { generateToken, isAuth } from "../Utils.js";

const orderRoutes = express.Router();

orderRoutes.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });
    const order = await newOrder.save();
    res.status(201).send({ message: "New order created ", order });
  })
);
orderRoutes.get("/:id",isAuth, async (req, res) => {
  const orderData = await Order.findById(req.params.id);
  if (orderData) {
    res.send(orderData);
  } else {
    res.status(404).send({ message: "Order Not Found" });
  }
});
orderRoutes.get("/", async (req, res) => {
  const orderData = await Order.find();
  res.send(orderData);
});
export default orderRoutes;
