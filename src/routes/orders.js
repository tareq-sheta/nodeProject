import {
  showAll,
  showOne,
  destroy,
  update,
  create,
} from "../controllers/orders.js";

import express from "express";

import { AuthorizeUser } from "../middleware/Authenticate-Autherize.js";
import { validReference } from "../middleware/validReference.js";
import sameUserRestrictOrder from "../middleware/sameUserRestrictOrders.js";

const ordersRouter = express.Router();
ordersRouter.get("/", AuthorizeUser("user", "seller", "admin"), showAll);
ordersRouter.get(
  "/:id",
  AuthorizeUser("user", "seller", "admin"),
  sameUserRestrictOrder,
  showOne
);
ordersRouter.patch(
  "/:id",
  AuthorizeUser("user", "seller", "admin"),
  validReference("product"),
  sameUserRestrictOrder,
  update
);
ordersRouter.delete(
  "/:id",
  AuthorizeUser("user", "seller", "admin"),
  sameUserRestrictOrder,
  destroy
);
ordersRouter.post(
  "/",
  AuthorizeUser("user", "seller", "admin"),
  validReference("product"),
  create
);

// userRouter.get("/users", AuthorizeUser, showAll);
// userRouter.get("/users/:id", AuthorizeUser, showOne);
// userRouter.put("/users", AuthorizeUser, update); //must include all properties like id and other optional properties
// userRouter.delete("/users/:id", AuthorizeUser, destroy);
// userRouter.post("/users/register", register);
// userRouter.post("/users/login", login);
// };

export default ordersRouter;
