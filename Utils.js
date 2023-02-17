import jwt, { decode } from "jsonwebtoken";
import User from "./models/UserModel.js";

export const generateToken = (user) => {
  const token = jwt.sign(
    { name: user.name, email: user.email, isAdmin: user.isAdmin }, //because we dont want to password also into jwt
    process.env.JWT_SECRET
  );

  return token;
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        res.status(401).send({ message: "invalid token" });
      } else {
        if (decoded && !decoded._id) {
          console.log("no id ");
          const userData = await User.findOne({ email: decoded.email });
          req.user = userData;
          next();
        } else {
          console.log("Id coming");
          req.user = decoded;
          next();
        }
      }
    });
  } else {
    res.status(401).send({ message: "No token" });
  }
};
