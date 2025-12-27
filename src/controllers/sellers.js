// import { User, User_type } from "../models/users"; //import required variables
//  import {tokenSecret} from "../DB_connect";
import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
// import express from "express";
import Sellers from "../models/cart.js";
import { authenticateUser } from "../middleware/Authenticate-Autherize.js";

import { CustomError } from "../utils/ErrorHandler.js";
const store = new Sellers();

/*
 *
 *
 *
 *
 *
 *
 */

export const showAll = async (_req, res, next) => {
  try {
    const allSellers = await store.showAll();
    res.json(allSellers);
  } catch (error) {
    // next(
    //   res.json({
    //     msg: `showAll methode in users controller didnt work ${Object.keys(
    //       error
    //     )} ,status code: ${res.statusCode}`,
    //   })
    // );
    if (error instanceof jwt.JsonWebTokenError) {
      next(
        new CustomError(
          "Invalid or expired token.",
          401,
          "in sellers showAll controller"
        )
      );
    } else {
      next(error);
    }
  }
};
/*
 *
 *
 *
 *
 *
 *
 *
 */
export const showOne = async (req, res, next) => {
  try {
    const oneSeller = await store.showOne({ _id: req.params.id });
    //console.log(oneSeller, "oneSeller showOne controller");
    if (!oneSeller) {
      throw new CustomError(
        "seller not found",
        404,
        "in sellers showOne controller"
      );
    }
    res.json(oneSeller);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(
        new CustomError(
          "Invalid or expired token.",
          401,
          "in sellers showOne controller"
        )
      );
    } else {
      next(error);
    }
  }
};
/*
 *
 *
 *
 *
 *
 *
 *
 */

/*
 *
 *
 *
 *
 *
 *
 */
export const update = async (req, res, next) => {
  // //console.log(req.body, "      rrr     ");

  try {
    // //console.log(req.headers["authorization"], "      aaa     ");
    let updatedSeller = req.body;
    if (!req.body) {
      throw new CustomError(
        "No data provided",
        400,
        "in sellers update controller"
      );
    }
    // let updateUser = {
    //   id: id,
    //   first_name,
    //   last_name,
    //   user_password,
    // };

    const editSeller = await store.update({
      _id: req.params.id,
      ...updatedSeller,
    });
    if (!editSeller) {
      throw new CustomError(
        "failed to update user, user not found",
        404,
        "in sellers update controller"
      );
    }
    res.json(editSeller);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(
        new CustomError(
          "Invalid or expired token.",
          401,
          "in sellers update controller"
        )
      );
    } else {
      next(error);
    }
  }
};

export const resetPassword = async (req, res, next) => {
  // //console.log(req.body, "      rrr     ");

  try {
    // //console.log(req.headers["authorization"], "      aaa     ");
    let { password } = req.body;
    if (!req.body) {
      throw new CustomError(
        "No data provided",
        400,
        "in sellers update controller"
      );
    }

    // let updateUser = {
    //   id: id,
    //   first_name,
    //   last_name,
    //   user_password,
    // };

    const editSeller = await store.update({
      _id: req.params.id,
      password,
    });
    if (!editSeller) {
      throw new CustomError(
        "failed to update user, user not found",
        404,
        "in sellers update controller"
      );
    }
    res.json(editSeller);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(
        new CustomError(
          "Invalid or expired token.",
          401,
          "in sellers update controller"
        )
      );
    } else {
      next(error);
    }
  }
};
/*
 *
 *
 *
 *
 *
 *
 *
 */
export const destroy = async (req, res, next) => {
  //create delete api
  try {
    if (typeof req.params.id === undefined) {
      res.send("please add a user id to be deleted");
      throw new CustomError(
        "please add a user id to be deleted",
        404,
        "in sellers destroy controller"
      );
    }
    const deleted = await store.delete(req.params.id);
    //console.log(deleted, "deleted destroy controller ");
    if (typeof deleted === undefined) {
      throw new CustomError(
        "user id to be deleted is not available",
        404,
        "in users destroy controller"
      );
    }
    res.json({
      msg: `deleted successfully`,
    });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(
        new CustomError(
          "Invalid or expired token.",
          401,
          "in users destroy controller"
        )
      );
    } else {
      next(err);
    }
  }
};
/*
 *
 *
 *
 *
 */
export const register = async (req, res, next) => {
  //console.log("register");
  try {
    let newUser = req.body;
    //console.log("reqbody register", newUser);

    if (!req.body) {
      throw new CustomError(
        "no body provided",
        400,
        "in users register controller"
      );
    }
    // const oneUser = await store.showOne(newUser);
    const oneUser = await store.showOne({ username: newUser.username });
    //console.log(oneUser);
    if (oneUser) {
      throw new CustomError(
        "user already exists",
        400,
        "in users register controller"
      );
    }
    //console.log("before create", newUser);
    const createdUser = await store.create(newUser);
    //console.log("after create", createdUser);
    // const token = jwt.sign(newUser,tokenSecret as string)

    if (createdUser.username === null || createdUser.password === null) {
      throw new CustomError(
        "one of the new user is undefined (first_name or user_password)",
        400,
        "in users register controller"
      );
    }
    // //console.log(`after checking if any prprty is`)
    res.status(201).json({ createdUser, msg: "user created successfully" });
  } catch (err) {
    // next(
    //   res.json({
    //     msg: `create methode in users controller didnt work ${Object.keys(err)}`,
    //   })
    // );
    if (err instanceof jwt.JsonWebTokenError) {
      next(
        new CustomError(
          "Invalid or expired token.",
          401,
          "in users register controller"
        )
      );
    } else {
      // For all other errors, pass the original error to the global controller.
      next(err);
    }
  }
};
/*
 *
 *
 *
 *
 */
export const login = async (req, res, next) => {
  //create authenticate api
  try {
    if (!req.body) {
      throw new CustomError("no body", 400, "in users login controller");
    }

    let { username, password } = req.body;

    // let full_name=first_name+last_name;

    let loggingUser = await authenticateUser(username, password);
    //console.log(loggingUser, "inside login controller");
    // if (loggingUser === null) {
    //   return res.status(401).json({ msg: });
    // }
    if (loggingUser === null) {
      throw new CustomError(
        "invalid username or password",
        401,
        "in users login controller"
      );
    }

    let myToken = jwt.sign({ loggingUser }, process.env.tokenSecret);

    return res.json(myToken);
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(
        new CustomError(
          "Invalid or expired token.",
          401,
          "in users login controller"
        )
      );
    } else {
      // For all other errors, pass the original error to the global controller.
      next(err);
    }
  }
};

/*
 *
 *
 *
 *
 *
 *
 *
 */

// const userRoutes = (app: express.Application) => {
//create a variable holding all apis to be exported
