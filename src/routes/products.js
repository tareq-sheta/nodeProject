import {
  showAll,
  showOne,
  destroy,
  update,
  create,
} from "../controllers/products.js";

import express from "express";

import { AuthorizeUser } from "../middleware/Authenticate-Autherize.js";
import sameUserRestrictProducts from "../middleware/sameUserRestrictProducts.js";

const productsRouter = express.Router();
productsRouter.get("/", showAll);
productsRouter.get(
  "/:id",
  AuthorizeUser("user", "seller", "admin"),
  sameUserRestrictProducts,
  showOne
);
productsRouter.patch(
  "/:id",
  AuthorizeUser("seller", "admin"),
  sameUserRestrictProducts,
  update
);
productsRouter.delete(
  "/:id",
  AuthorizeUser("seller", "admin"),
  sameUserRestrictProducts,
  destroy
);
productsRouter.post("/", AuthorizeUser("seller", "admin"), create);

// userRouter.get("/users", AuthorizeUser, showAll);
// userRouter.get("/users/:id", AuthorizeUser, showOne);
// userRouter.put("/users", AuthorizeUser, update); //must include all properties like id and other optional properties
// userRouter.delete("/users/:id", AuthorizeUser, destroy);
// userRouter.post("/users/register", register);
// userRouter.post("/users/login", login);
// };

export default productsRouter;
