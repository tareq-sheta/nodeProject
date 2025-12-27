import Cart from "../models/cart.js";
import { CustomError } from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

async function sameUserRestrictCart(req, res, next) {
  try {
    const cartId = req.params.id;
    if (req.currentUser.rule === "user") {
      const cart = await new Cart().showOne({ _id: cartId });
      if (!cart) {
        throw new CustomError(
          "cart not found",
          404,
          "sameUserRestrictCart middleware"
        );
      }
      let userOwnerId = cart.user;
      let currentUserId = req.currentUser._id;

      if (userOwnerId.toString() !== currentUserId.toString()) {
        throw new CustomError(
          "a user can't acess other users cart",
          403,
          "sameUserRestrictCart middleware"
        );
      }
    }
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(
        new CustomError(
          "Invalid or expired token.",
          401,
          "in cart sameUserRestrictCart controller"
        )
      );
    } else {
      next(error);
    }
  }
}
export default sameUserRestrictCart;
