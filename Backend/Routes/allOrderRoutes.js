import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/OrderModel.js";
import { generateToken, isAuth } from "../Utils.js";

const allOrderRoutes = express.Router();

allOrderRoutes.get("/", isAuth, async (req, res) => {
  const orderData = await Order.find({ user: req.user._id });
  res.send(orderData);
});

allOrderRoutes.put("/:id/pay", async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address
    }
    const updatedOrder = await order.save()
    res.send({ message: "Order Paid", order: updatedOrder });
  } else {
    res.status(404).send({ message: "Order Not Found" })
  }

});

export default allOrderRoutes;
