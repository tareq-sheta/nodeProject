// import { User, User_type } from "../models/users"; //import required variables
//  import {tokenSecret} from "../DB_connect";
import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
// import express from "express";
import Users from "../models/users.js";
import { authenticateUser } from "../middleware/Authenticate-Autherize.js";

import { CustomError } from "../utils/ErrorHandler.js";
const store = new Users();

/*
 *
 *
 *
 *
 *
 *
 */

export const showAll = async (_req, res, next) => {
  //     //console.log(req.headers['authorization'])

  //           const authrztionHeader = req.headers.authorization // getting the the auth header which contain the token

  //           // const authorizationHeader = req.headers["authorization"]    2nd way to write the code

  //            const  token =/*  authrztionHeader ? */ authrztionHeader!.split(' ')[1]/*  : res.json("There is no token in the request") */// note: auth header = Bearer "eyJhb...token"
  //              if(!token || !authrztionHeader){
  //                throw res.json(new Error("unathorized"));
  //                return

  //               }

  //          //use ternary operator to split the auth header at (" ") and take the second arr element as the token
  // //       --------------------
  // //       let token
  // //       if(authorizationHeader) token = authorizationHeader.split(' ')[1]    2nd way to write the code (regular if statement)
  // //
  // //       --------------------
  // //       const token =authorizationHeader!.split(' ')[1] : res.json("There is no token in the request")   3rd way to write the code

  //           jwt.verify(token as string, tokenSecret as string,(err,usr)=>{
  //             if(err){
  //               return res.json({errmsg:`error in the varify function in index controller`})
  //             }

  //           });
  //       // //console.log(authrztionHeader,token,decoded)

  //         res.json(`error the token validaton in user controller`)}

  try {
    const allUsers = await store.showAll();
    res.json(allUsers);
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
          "in users showAll controller"
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
  //   try {
  //     const authorizationHeader = req.headers.authorization

  //        const token =/* authorizationHeader ?  */authorizationHeader!.split(' ')[1]/*  : res.json("There is no token in the request") */
  //        const decoded = jwt.verify(token as string, tokenSecret as string);
  //        //console.log(authorizationHeader,token,decoded)
  //        if(decoded !== req.body) {
  //         throw new Error('User id does not match!')
  //     }

  // } catch(err) {
  //     res.status(401)
  //     res.json(err)
  //     return
  // }
  try {
    const oneUser = await store.showOne({ _id: req.params.id });
    //console.log(oneUser, "oneUser showOne controller");
    if (!oneUser) {
      throw new CustomError(
        "user not found",
        404,
        "in users showOne controller"
      );
    }
    res.json(oneUser);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(
        new CustomError(
          "Invalid or expired token.",
          401,
          "in users showOne controller"
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
    let updatedUser = req.body;
    if (!req.body) {
      throw new CustomError(
        "No data provided",
        400,
        "in users update controller"
      );
    }
    // let updateUser = {
    //   id: id,
    //   first_name,
    //   last_name,
    //   user_password,
    // };
    // if (req.currentUser.rule !== "admin") {
    //   let isSameUser = req.currentUser._id === req.params.id;
    //   if (!isSameUser) {
    //     throw new CustomError(
    //       "cant update user with different ids",
    //       404,
    //       "in users update controller"
    //     );
    //   }
    // }

    const editUser = await store.update({
      _id: req.params.id,
      ...updatedUser,
    });
    if (!editUser) {
      throw new CustomError(
        "failed to update user, user not found",
        404,
        "in users update controller"
      );
    }
    res.json(editUser);
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(
        new CustomError(
          "Invalid or expired token.",
          401,
          "in users update controller"
        )
      );
    } else {
      next(err);
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
        "in users update controller"
      );
    }

    // let updateUser = {
    //   id: id,
    //   first_name,
    //   last_name,
    //   user_password,
    // };

    const editUser = await store.update({
      _id: req.params.id,
      password,
    });
    if (!editUser) {
      throw new CustomError(
        "failed to update user, user not found",
        404,
        "in users update controller"
      );
    }
    res.json(editUser);
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(
        new CustomError(
          "Invalid or expired token.",
          401,
          "in users update controller"
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
        "in users destroy controller"
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
    // req.currentUser = loggingUser;
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
