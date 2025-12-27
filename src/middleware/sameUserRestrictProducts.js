import Products from "../models/products.js";
import { CustomError } from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

async function sameUserRestrictProducts(req, res, next) {
  try {
    console.log(req.currentUser, "sameUserRestrictUsers middleware");
    if (req.currentUser.rule === "seller") {
      const product = await new Products().showOne({ _id: req.params.id });
      if (product.sellerName !== req.currentUser.username) {
        throw new CustomError(
          "a seller can't acess other sellers products",
          403,
          "sameUserRestrictUsers middleware"
        );
      }
    }
    // if (req.currentUser.rule === "user") {
    //  req.params.id = req.params.id
    // }
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(
        new CustomError(
          "Invalid or expired token.",
          401,
          "in products sameUserRestrictProducts controller"
        )
      );
    } else {
      next(error);
    }
  }
}
export default sameUserRestrictProducts;
