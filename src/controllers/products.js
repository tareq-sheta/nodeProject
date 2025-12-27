// import { Product, Product_Type } from "../models/products";
// import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/ErrorHandler.js";
import Products from "../models/products.js";
import mongoose from "mongoose";
const store = new Products();
/*
 *
 *
 *
 */
export const showAll = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new CustomError(
        "Unauthorized access.",
        403,
        "in products showAll controller"
      );
    }
    const allProducts = await store.showAll();
    res.json(allProducts);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(
        new CustomError(
          "Invalid or expired token.",
          401,
          "in products showAll controller"
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
//-------------
export const showOne = async (req, res, next) => {
  try {
    const id = req.params.id;
    // let searchName = id.split("%20").join(" ");
    // let oneProduct;
    // if (mongoose.Types.ObjectId.isValid(id)) {
    //   oneProduct = await store.showOne({ _id: id });
    // } else {
    //   oneProduct = await store.showOne({ name: searchName });
    // }
    let oneProduct = await store.showOne(id);
    //console.log(oneProduct, "oneProduct showOne controller");
    if (!oneProduct) {
      throw new CustomError(
        "product not found",
        404,
        "in products showOne controller"
      );
    }
    res.json(oneProduct);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(
        new CustomError(
          "Invalid or expired token.",
          401,
          "in products showOne controller"
        )
      );
    } else {
      next(error);
    }
  }
};
//------------

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
    let updatedProduct = req.body;
    if (!req.body) {
      throw new CustomError(
        "No data provided",
        400,
        "in products update controller"
      );
    }
    // let updateUser = {
    //   id: id,
    //   first_name,
    //   last_name,
    //   user_password,
    // };

    const editProduct = await store.update({
      _id: req.params.id,
      ...updatedProduct,
    });
    if (!editProduct) {
      throw new CustomError(
        "failed to update product, product not found",
        404,
        "in products update controller"
      );
    }
    res.json(editProduct);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(
        new CustomError(
          "Invalid or expired token.",
          401,
          "in products update controller"
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
      res.send("please add a product id to be deleted");
      throw new CustomError(
        "please add a product id to be deleted",
        404,
        "in products destroy controller"
      );
    }
    const deleted = await store.delete(req.params.id);
    //console.log(deleted, "deleted destroy controller ");
    if (typeof deleted === undefined) {
      throw new CustomError(
        "product id to be deleted is not available",
        404,
        "in products destroy controller"
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
          "in products destroy controller"
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
export const create = async (req, res, next) => {
  //console.log("create");
  try {
    let newProduct = req.body;
    //console.log("reqbody create", newProduct);
    console.log(req.currentUser, "req.currentUser");
    if (!req.body) {
      throw new CustomError(
        "no body provided",
        400,
        "in products create controller"
      );
    }
    // const oneUser = await store.showOne(newUser);
    const oneProduct = await store.showOne({ name: newProduct.name });
    //console.log(oneProduct);
    if (oneProduct) {
      throw new CustomError(
        "product already exists",
        400,
        "in products create controller"
      );
    }
    newProduct.sellerName = req.currentUser.username;
    //console.log("before create", newProduct);
    const createdProduct = await store.create(newProduct);
    //console.log("after create", createdProduct);
    // const token = jwt.sign(newUser,tokenSecret as string)

    if (createdProduct.name === null || createdProduct.price === null) {
      throw new CustomError(
        "one of the new product is undefined (name or price)",
        400,
        "in products create controller"
      );
    }
    // //console.log(`after checking if any prprty is`)
    res
      .status(201)
      .json({ createdProduct, msg: "product created successfully" });
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
          "in products create controller"
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
