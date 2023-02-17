import express from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../Utils.js";

const userRoutes = express.Router();

userRoutes.get("/", async (req, res) => {
  const users = await User.find({});

  if (users) {
    res.send(users);
  } else {
    res.status(404);
  }
});
// userRoutes.get("/:id", async (req, res) => {
//   const user = await User.findById(req.params.id);
//   if (user) {
//     res.send(user);
//   } else {
//     res.status(404).send({ message: "User not found" });
//   }
// });
userRoutes.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.admin,
          token: generateToken(user),
        });
        return;
      }else {
        res.status(404).send({ message: "Wrong password" });
      }
    }
    else {
      res.status(404).send({ message: "credentials wrong" });
    }
  })
);

userRoutes.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password)
    })
    const user = await newUser.save()
    res.send({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.admin,
      token: generateToken(user),
    });
  })
);
export default userRoutes;
