import {
  showAll,
  showOne,
  destroy,
  update,
  create,
} from "../controllers/cart.js";

import express from "express";
import { validReference } from "../middleware/validReference.js";
import { AuthorizeUser } from "../middleware/Authenticate-Autherize.js";
import sameUserRestrictCart from "../middleware/sameUserRestrictCart.js";

const cartRouter = express.Router();
cartRouter.get("/", AuthorizeUser("user", "admin"), showAll);
cartRouter.get(
  "/:id",
  AuthorizeUser("user", "admin"),
  sameUserRestrictCart,
  showOne
);
cartRouter.patch(
  "/:id",
  AuthorizeUser("user", "admin"),
  validReference("product"),
  sameUserRestrictCart,
  update
);
cartRouter.delete(
  "/:id",
  AuthorizeUser("user", "admin"),
  sameUserRestrictCart,
  destroy
);
cartRouter.post(
  "/",
  AuthorizeUser("user", "admin"),
  // validReference("product"),
  create
);

// userRouter.get("/users", AuthorizeUser, showAll);
// userRouter.get("/users/:id", AuthorizeUser, showOne);
// userRouter.put("/users", AuthorizeUser, update); //must include all properties like id and other optional properties
// userRouter.delete("/users/:id", AuthorizeUser, destroy);
// userRouter.post("/users/register", register);
// userRouter.post("/users/login", login);
// };

export default cartRouter;
