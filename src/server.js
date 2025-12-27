import express from "express";

import mongoose from "mongoose";
import cors from "cors";
import usersRouter from "./routes/users.js";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";
import cartRouter from "./routes/cart.js";
// const port = process.env.PORT || 8080;
const app = express();

mongoose
  .connect("mongodb://localhost:27017/nodeProj")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));
app.listen(8888, () => {
  console.log(`server is listening to port No. ${8888}`);
  // //console.log(process.env.mypepper);
  /* //console.log(thing);
  //console.log(ENV);
  //console.log(typeof thing); */
});
app.use(cors());
app.use(express.json());

// app.use(authenticateUser);
// app.use("/products",productRoutes);
app.use("/orders", ordersRouter);
app.use("/cart", cartRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use((req, res) => {
  return res.status(404).json({ message: "this path is not valid" });
});
app.use((err, req, res, next) => {
  //console.log(err);
  return res
    .status(err.status || 500)
    .json({ "from Err controller": err.message, location: err.location });
});
// app.use("/orders",orderRoutes);

export default app;
