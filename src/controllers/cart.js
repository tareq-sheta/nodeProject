// import { Order, Order_Type } from "../models/orders";
// import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/ErrorHandler.js";
import Cart from "../models/cart.js";
const store = new Cart();
/*
 *
 *
 *
 */
export const showAll = async (_req, res, next) => {
  try {
    const allCart = await store.showAll(_req.currentUser._id);

    let populatedCart = await Promise.all(
      allCart.map((cart) =>
        store.populateMultiple({ _id: cart._id }, [
          { path: "user", model: "Users" },
          { path: "products.product", model: "Products" },
        ])
      )
    );
    res.json(populatedCart);
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
          "in cart showAll controller"
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
    const oneCart = await store.showOne({ _id: req.params.id });
    //console.log("\n\n\n" + oneCart, "oneCart showOne controller");
    // console.log("\n\n\n" + oneCart, "_____oneCart showOne controller_____");

    if (!oneCart) {
      throw new CustomError(
        "cart not found",
        404,
        "in cart showOne controller"
      );
    }
    const updatedCart = await store.populateMultiple({ _id: oneCart._id }, [
      { path: "user", model: "Users" },
      { path: "products.product", model: "Products" },
    ]);

    const cartResponse = {
      _id: updatedCart._id,
      user: {
        name: updatedCart.user.username,
        rule: updatedCart.user.rule,
      },
      createdAt: updatedCart.createdAt,
      updatedAt: updatedCart.updatedAt,
      products: updatedCart.products.map((item) => ({
        _id: item.product._id,
        name: item.product.name,
        description: item.product.description,
        photo: item.product.photo,
        sellerName: item.product.sellerName,
        quantity: item.quantity,
      })),
    };
    res.json(cartResponse);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(
        new CustomError(
          "Invalid or expired token.",
          401,
          "in cart showOne controller"
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
  try {
    let updatedCart = req.body;
    if (!req.body) {
      throw new CustomError(
        "No data provided",
        400,
        "in cart update controller"
      );
    }
    // let updateUser = {
    //   id: id,
    //   first_name,
    //   last_name,
    //   user_password,
    // };

    const editCart = await store.update({
      _id: req.params.id,
      ...updatedCart,
    });
    console.log("\n\n\n" + editCart, "editCart update controller");
    if (!editCart) {
      throw new CustomError(
        "failed to update cart, cart not found",
        404,
        "in cart update controller"
      );
    }
    res.json(editCart);
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(
        new CustomError(
          "Invalid or expired token.",
          401,
          "in cart update controller"
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
      // res.send("please add a cart id to be deleted");
      // throw new CustomError(
      //   "please add a cart id to be deleted",
      //   404,
      //   "in cart destroy controller"
      // );
      res.status(404).json({ msg: "please add a cart id to be deleted" });
    }
    const deleted = await store.delete(req.params.id);
    //console.log("\n\n\n" + deleted, "deleted destroy controller ");
    if (typeof deleted === undefined) {
      throw new CustomError(
        "cart id to be deleted is not available",
        404,
        "in cart destroy controller"
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
          "in cart destroy controller"
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
 */ //------------
// export const create = async (req, res, next) => {
//   try {
//     const { user, products } = req.body;
//     //console.log("\n\n\n" + user, "user create controller");
//     //console.log("\n\n\n" + products, "products create controller");
//     // A single controller to handle both creation and updates
//     if (!user || !products) {
//       throw new CustomError(
//         "no body provided",
//         400,
//         "in cart create controller"
//       );
//     }

//     const createdCart = await store.create({ user: user, products: products });
//     //console.log("\n\n\n" + createdCart, "createdCart create controller");
//     if (createdCart === null) {
//       throw new CustomError(
//         "cart already exists",
//         400,
//         "in cart create controller"
//       );
//     }
//     // const updatedCart = await store
//     //   .showOne({ _id: createdCart._id })
//     //   .populate("products._productId");
//     //console.log("\n\n\n" + createdCart, "createdCart create controller");
//     const updatedCart = await store.populateField(
//       { _id: createdCart._id },
//       "products.product"
//     );
//     //console.log("\n\n\n" + updatedCart, "updatedCart create controller");
//     // In your controller after getting the populated cart (updatedCart)
//     const cartResponse = {
//       _id: updatedCart._id,
//       user: updatedCart.user,
//       createdAt: updatedCart.createdAt,
//       updatedAt: updatedCart.updatedAt,
//       // Transform the products array
//       products: updatedCart.products.map((item) => ({
//         // Use the product's _id as the main ID for the item
//         _id: item.product._id,
//         name: item.product.name,
//         description: item.product.description,
//         photo: item.product.photo,
//         sellerName: item.product.sellerName,
//         // Add the quantity from the cart item
//         quantity: item.quantity,
//       })),
//     };

//     // Send the cleaner, transformed object in the response
//     // res
//     //   .status(200)
//     //   .json({ cart: cartResponse, msg: "Cart updated successfully" });
//     res
//       .status(200)
//       .json({ createdCart: cartResponse, msg: "Cart updated successfully" });
//   } catch (err) {
//     next(err);
//   }
// };
//----------------

export const create = async (req, res, next) => {
  try {
    const { products } = req.body;

    if (!products) {
      throw new CustomError(
        "no body provided",
        400,
        "in cart create controller"
      );
    }
    const user = req.currentUser._id;
    const existingCart = await store.showOne({ user });
    if (existingCart) {
      throw new CustomError(
        "cart with current user already exists",
        400,
        "in cart create controller"
      );
    }
    const createdCart = await store.create({ user, products });
    // const updatedCart = await store.populateField(
    //   { _id: createdCart._id },
    //   "products.product"
    // );
    const updatedCart = await store.populateMultiple({ _id: createdCart._id }, [
      { path: "user", model: "Users" },
      { path: "products.product", model: "Products" },
    ]);

    const cartResponse = {
      _id: updatedCart._id,
      user: {
        name: updatedCart.user.username,
        rule: updatedCart.user.rule,
      },
      createdAt: updatedCart.createdAt,
      updatedAt: updatedCart.updatedAt,
      products: updatedCart.products.map((item) => ({
        _id: item.product._id,
        name: item.product.name,
        description: item.product.description,
        photo: item.product.photo,
        sellerName: item.product.sellerName,
        quantity: item.quantity,
      })),
    };

    res.status(200).json(cartResponse);
  } catch (err) {
    if (err.code === 11000 && err.name === "MongoServerError") {
      // Handle the specific duplicate key error
      next(
        new CustomError(
          "A cart for this current user already exists.",
          409, // Use 409 Conflict for resource conflict
          "in cart create controller"
        )
      );
    } else {
      next(err);
    }
  }
};
// export const create = async (req, res, next) => {
//   //console.log("create");
//   try {
//     let { _userId, products } = req.body;
//     //console.log("reqbody create", _userId, products);

//     if (!req.body) {
//       throw new CustomError(
//         "no body provided",
//         400,
//         "in cart create controller"
//       );
//     }
//     // const oneUser = await store.showOne(newUser);
//     const oneCart = await store.showOne({ _userId: _userId });
//     //console.log("\n\n\n" + oneCart, "oneCart create controller");
//     if (oneCart) {
//       throw new CustomError(
//         "cart already exists",
//         400,
//         "in cart create controller"
//       );
//     }
//     //console.log("\n\n\nbefore create", _userId, products);
//     const createdCart = await store.create(
//       "68d09eab7bca1dbbcc155746",
//       products
//     );
//     //console.log("\n\n\nafter create", createdCart);
//     // const token = jwt.sign(newUser,tokenSecret as string)

//     if (createdCart.username === null || createdCart.password === null) {
//       throw new CustomError(
//         "one of the new order is undefined (first_name or user_password)",
//         400,
//         "in cart create controller"
//       );
//     }
//     // //console.log(`after checking if any prprty is`)
//     res.status(201).json({ createdCart, msg: "cart created successfully" });
//   } catch (err) {
//     // next(
//     //   res.json({
//     //     msg: `create methode in users controller didnt work ${Object.keys(err)}`,
//     //   })
//     // );
//     if (err instanceof jwt.JsonWebTokenError) {
//       next(
//         new CustomError(
//           "Invalid or expired token.",
//           401,
//           "in cart create controller"
//         )
//       );
//     } else {
//       // For all other errors, pass the original error to the global controller.
//       next(err);
//     }
//   }
// };
/*
 *
 *
 *
 *
 */
// export const login = async (req, res, next) => {
//   //create authenticate api
//   try {
//     if (!req.body) {
//       throw new CustomError("no body", 400, "in users login controller");
//     }

//     let { username, password } = req.body;

//     // let full_name=first_name+last_name;

//     let loggingUser = await authenticateUser(username, password);
//     //console.log(loggingUser, "inside login controller");
//     // if (loggingUser === null) {
//     //   return res.status(401).json({ msg: });
//     // }
//     if (loggingUser === null) {
//       throw new CustomError(
//         "invalid username or password",
//         401,
//         "in users login controller"
//       );
//     }

//     let myToken = jwt.sign({ loggingUser }, process.env.tokenSecret);

//     return res.json(myToken);
//   } catch (err) {
//     if (err instanceof jwt.JsonWebTokenError) {
//       next(
//         new CustomError(
//           "Invalid or expired token.",
//           401,
//           "in users login controller"
//         )
//       );
//     } else {
//       // For all other errors, pass the original error to the global controller.
//       next(err);
//     }
//   }
// };
/*
 *
 *
 *
 */

// const orderRoutes = (app) => {
//   app.get("/orders", index);
//   app.get("/orders/:id", show);
//   app.post("/orders", create);
//   app.put("/orders", update);
//   app.delete("/orders", destroyRow);
// };

// export default orderRoutes;
