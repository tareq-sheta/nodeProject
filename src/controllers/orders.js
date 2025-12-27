import jwt from "jsonwebtoken";
import { CustomError } from "../utils/ErrorHandler.js";
import Orders from "../models/orders.js";
import Cart from "../models/cart.js";
const store = new Orders();
/*
 *
 *
 *
 */
export const showAll = async (req, res, next) => {
  try {
    let query = {};
    if (req.currentUser.rule === "user") {
      query = { user: req.currentUser._id };
    }

    const allOrders = await store.showAll(query);
    const populatedOrders = await Promise.all(
      allOrders.map((order) =>
        store.populateMultiple({ _id: order._id }, [
          { path: "user", model: "Users" },
          { path: "products.product", model: "Products" },
        ])
      )
    );
    let filteredOrders = [...populatedOrders];
    if (req.currentUser.rule === "seller") {
      filteredOrders = filteredOrders.filter((order) => {
        // console.log("seller");
        return order.products.some(
          (product) => product.product.sellerName === req.currentUser.username
        );
      });
    }

    const orderResponse = filteredOrders.map((order) => {
      return {
        _id: order._id,
        user: order.user,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        products: order.products.map((item) => ({
          _id: item.product._id,
          name: item.product.name,
          description: item.product.description,
          photo: item.product.photo,
          sellerName: item.product.sellerName,
          quantity: item.quantity,
        })),
      };
    });
    res.json(orderResponse);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(
        new CustomError(
          "Invalid or expired token.",
          401,
          "in orders showAll controller"
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
    const oneOrder = await store.showOne({ _id: req.params.id });
    // console.log(oneOrder, "oneOrder showOne controller");
    if (!oneOrder) {
      throw new CustomError(
        "order not found",
        404,

        "in orders showOne controller"
      );
    }
    const updatedOrder = await store.populateMultiple({ _id: oneOrder._id }, [
      { path: "user", model: "Users" },
      { path: "products.product", model: "Products" },
    ]);
    let filteredProducts = updatedOrder;
    if (req.currentUser.rule === "seller") {
      // console.log("seller");
      filteredProducts = filteredProducts.products.filter((product) => {
        console.log(product, "in filter product\n\n\n");
        console.log(req.currentUser, "in filter req.currentUser\n\n\n");
        return product.product.sellerName === req.currentUser.username;
      });
      console.log(filteredProducts, "filteredProducts\n\n\n");
      if (filteredProducts.length === 0) {
        throw new CustomError(
          "as a seller you dont have access to this order",
          403,

          "in orders showOne controller"
        );
      }
    }
    const orderResponse = {
      _id: updatedOrder._id,
      user: updatedOrder.user,
      createdAt: updatedOrder.createdAt,
      updatedAt: updatedOrder.updatedAt,
      products: filteredProducts.map((item) => ({
        _id: item.product._id,
        name: item.product.name,
        description: item.product.description,
        photo: item.product.photo,
        sellerName: item.product.sellerName,
        quantity: item.quantity,
      })),
    };
    // res.json(orderResponse);
    res.json(orderResponse);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(
        new CustomError(
          "Invalid or expired token.",
          401,
          "in orders showOne controller"
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
    let updatedOrder = req.body;
    if (!req.body) {
      throw new CustomError(
        "No data provided",
        400,
        "in orders update controller"
      );
    }
    updatedOrder = new Orders().showOne({ _id: req.params.id });
    if (updatedOrder.status !== "pending") {
      throw new CustomError(
        "order status is not pending",
        400,
        "in orders update controller"
      );
    }
    if (
      req.currentUser.rule === "user" &&
      updatedOrder.user.toString() !== req.currentUser._id
    ) {
      throw new CustomError(
        "as a user you dont have access to this order",
        403,
        "in orders update controller"
      );
    }
    let canSellerEdit = updatedOrder.products.some(
      (product) => product.product.sellerName === req.currentUser.username
    );
    if (req.currentUser.rule === "seller" && !canSellerEdit) {
      throw new CustomError(
        "as a seller you dont have access to this order",
        403,
        "in orders update controller"
      );
    }

    // let updateUser = {
    //   id: id,
    //   first_name,
    //   last_name,
    //   user_password,
    // };

    const editOrder = await store.update({
      _id: req.params.id,
      ...updatedOrder,
    });
    if (!editOrder) {
      throw new CustomError(
        "failed to update order, order not found",
        404,
        "in orders update controller"
      );
    }

    const updatedOrderResponse = await store.populateMultiple(
      { _id: req.params.id },
      [
        { path: "user", model: "Users" },
        { path: "products.product", model: "Products" },
      ]
    );
    res.json(updatedOrderResponse);
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(
        new CustomError(
          "Invalid or expired token.",
          401,
          "in orders update controller"
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
      //   "in orders destroy controller"
      // );
      res.status(404).json({ msg: "please add a cart id to be deleted" });
    }
    const deleted = await store.delete(req.params.id);
    //console.log("\n\n\n" + deleted, "deleted destroy controller ");
    if (typeof deleted === undefined) {
      throw new CustomError(
        "order id to be deleted is not available",
        404,
        "in orders destroy controller"
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
          "in orders destroy controller"
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

// export const create = async (req, res, next) => {
//   try {
//     const currentUser = req.currentUser;
//     let orderProducts;
//     const currentUserCart = await new Cart().showOne({ user: currentUser._id });
//     if (currentUserCart.products.length > 0) {
//       orderProducts = currentUserCart.products;
//     } else {
//       const { products } = req.body;
//       orderProducts = products;
//     }
//     if (!orderProducts) {
//       throw new CustomError(
//         "no body provided or no products in cart",
//         400,
//         "in orders create controller"
//       );
//     }

//     const createdOrder = await new Orders().create({
//       user: currentUser._id,
//       products: orderProducts,
//     });

//     const updatedOrder = await new Orders().populateMultiple(
//       { _id: createdOrder._id },
//       [
//         { path: "user", model: "Users" },
//         { path: "products.product", model: "Products" },
//       ]
//     );

//     const orderResponse = {
//       _id: updatedOrder._id,
//       user: updatedOrder.user,
//       createdAt: updatedOrder.createdAt,
//       updatedAt: updatedOrder.updatedAt,
//       products: updatedOrder.products.map((item) => ({
//         _id: item.product._id,
//         name: item.product.name,
//         description: item.product.description,
//         photo: item.product.photo,
//         sellerName: item.product.sellerName,
//         quantity: item.quantity,
//       })),
//     };

//     res
//       .status(200)
//       .json({ createdOrder: orderResponse, msg: "Order created successfully" });
//   } catch (err) {
//     if (err.code === 11000 && err.name === "MongoServerError") {
//       // Handle the specific duplicate key error
//       next(
//         new CustomError(
//           "An order for this user already exists.",
//           409, // Use 409 Conflict for resource conflict
//           "in orders create controller"
//         )
//       );
//     } else {
//       next(err);
//     }
//   }
// };

export const create = async (req, res, next) => {
  try {
    const currentUser = req.currentUser;

    // 1. Find the current user's cart.
    const currentUserCart = await new Cart().showOne({ user: currentUser._id });
    // console.log(currentUserCart, "currentUserCart-create controller(orders)");
    // 2. Check if the cart exists and has products.
    if (!currentUserCart) {
      throw new CustomError(
        "Cannot create an order from an empty cart.",
        400,
        "in orders create controller"
      );
    }

    // 3. Create a new order using products from the cart.
    const orderProducts = currentUserCart.products;
    const createdOrder = await new Orders().create({
      user: currentUser._id,
      products: orderProducts,
    });

    await new Cart().delete(currentUserCart._id);

    const updatedOrder = await new Orders().populateMultiple(
      { _id: createdOrder._id },
      [
        { path: "user", model: "Users" },
        { path: "products.product", model: "Products" },
      ]
    );

    const orderResponse = {
      _id: updatedOrder._id,
      user: updatedOrder.user,
      createdAt: updatedOrder.createdAt,
      updatedAt: updatedOrder.updatedAt,
      products: updatedOrder.products.map((item) => ({
        _id: item.product._id,
        name: item.product.name,
        description: item.product.description,
        photo: item.product.photo,
        sellerName: item.product.sellerName,
        quantity: item.quantity,
      })),
    };

    res
      .status(201)
      .json({ createdOrder: orderResponse, msg: "Order created successfully" });
  } catch (err) {
    if (err.code === 11000 && err.name === "MongoServerError") {
      next(
        new CustomError(
          "An order for this user already exists.",
          409,
          "in orders create controller"
        )
      );
    } else {
      next(err);
    }
  }
};
