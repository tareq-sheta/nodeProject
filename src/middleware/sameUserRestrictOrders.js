import Orders from "../models/orders.js";
import { CustomError } from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

async function sameUserRestrictOrder(req, res, next) {
  try {
    const orderId = req.params.id;
    if (req.currentUser.rule === "user") {
      const order = await new Orders().showOne({ _id: orderId });
      if (!order) {
        throw new CustomError(
          "order not found",
          404,
          "sameUserRestrictOrder middleware"
        );
      }
      let userOwnerId = order.user;
      let currentUserId = req.currentUser._id;

      if (userOwnerId.toString() !== currentUserId.toString()) {
        throw new CustomError(
          "a user can't acess other users order",
          403,
          "sameUserRestrictOrder middleware"
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
          "in orders sameUserRestrictOrder controller"
        )
      );
    } else {
      next(error);
    }
  }
}
export default sameUserRestrictOrder;
