import {
  showAll,
  showOne,
  destroy,
  update,
  register,
  login,
  resetPassword,
} from "../controllers/users.js";

import express from "express";

import { AuthorizeUser } from "../middleware/Authenticate-Autherize.js";
import sameUserRestrict from "../middleware/sameUserRestrictUsers.js";
import sameUserRestrictUsers from "../middleware/sameUserRestrictUsers.js";

const usersRouter = express.Router();

usersRouter.get("/", AuthorizeUser("admin"), showAll);
usersRouter.get(
  "/:id",
  AuthorizeUser("user", "seller", "admin"),
  sameUserRestrictUsers,
  showOne
);
usersRouter.patch(
  "/:id",
  AuthorizeUser("user", "seller", "admin"),
  sameUserRestrictUsers,
  update
);
usersRouter.delete(
  "/:id",
  AuthorizeUser("user", "seller", "admin"),
  sameUserRestrictUsers,
  destroy
);
usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.patch(
  "/resetPassword/:id",
  AuthorizeUser("user", "seller", "admin"),
  sameUserRestrictUsers,
  resetPassword
);
// usersRouter.get("/", showAll);
// usersRouter.get("/:id", showOne);
// usersRouter.patch("/:id", update);
// usersRouter.delete("/:id", destroy);
// usersRouter.post("/register", register);
// usersRouter.post("/login", login);
// usersRouter.patch("/resetPassword/:id", AuthorizeUser, resetPassword);

// userRouter.get("/users", AuthorizeUser, showAll);
// userRouter.get("/users/:id", AuthorizeUser, showOne);
// userRouter.put("/users", AuthorizeUser, update); //must include all properties like id and other optional properties
// userRouter.delete("/users/:id", AuthorizeUser, destroy);
// userRouter.post("/users/register", register);
// userRouter.post("/users/login", login);
// };

export default usersRouter;
