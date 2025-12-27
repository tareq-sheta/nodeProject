import mongoose from "mongoose";

import Users from "../models/users.js";
import Products from "../models/products.js";
import Orders from "../models/orders.js";

// export function validReference(prop) {
//   return async (req, res, next) => {
//     try {
//       const items = req.body[`${prop}s`];
//       console.log(prop, "prop validReference middleware");
//       console.log(
//         "\n\n\n" + JSON.stringify(items),
//         "items validReference middleware"
//       );
//       // 1. Validate the array first to prevent crashes
//       if (!items || !Array.isArray(items) || items.length === 0) {
//         throw new CustomError(
//           `Request body must contain a non-empty '${prop}s' array.`,
//           400,
//           "in validReference middleware"
//         );
//       }
//       // let modal1 = new Users();
//       let modal;
//       if (prop === "product") {
//         modal = new Products();
//       } else if (prop === "order") {
//         modal = new Orders();
//       } else {
//         throw new CustomError(
//           `Invalid reference type: ${prop}`,
//           500,
//           "in validReference middleware"
//         );
//       }
//       // 2. Iterate and validate each item, throwing an error immediately if a problem is found
//       // const idToValidate1 = req.body.user;
//       for (const [i, value] of items.entries()) {
//         const idToValidate2 = value[prop];
//         //console.log(
//         //   "\n\n\n" + idToValidate1,
//         //   "idToValidate1 validReference middleware"
//         // );
//         //console.log(
//         //   "\n\n\n" + idToValidate2,
//         //   "idToValidate2 validReference middleware"
//         // );
//         // Check if the property exists and is a valid ObjectId
//         // if (!idToValidate1 || !mongoose.Types.ObjectId.isValid(idToValidate1)) {
//         //   throw new CustomError(
//         //     `Invalid or missing user ID ${idToValidate1}`,
//         //     400,
//         //     "in validReference middleware"
//         //   );
//         // }
//         if (!idToValidate2 || !mongoose.Types.ObjectId.isValid(idToValidate2)) {
//           throw new CustomError(
//             `Invalid or missing ${prop} ID at position 👉 ${i + 1}.`,
//             400,
//             "in validReference middleware"
//           );
//         }

//         // const foundDoc1 = await modal1.showOne({ _id: idToValidate1 });
//         const foundDoc2 = await modal.showOne({ _id: idToValidate2 });

//         // if (!foundDoc1) {
//         //   throw new CustomError(
//         //     `user with ID ${idToValidate1} has no reference.`,
//         //     404,
//         //     "in validReference middleware"
//         //   );
//         // }
//         if (!foundDoc2) {
//           throw new CustomError(
//             `${prop} with ID ${idToValidate2} at position ${
//               i + 1
//             } has no reference.`,
//             404,
//             "in validReference middleware"
//           );
//         }
//       }

//       // 3. Call next() only after all items have been validated
//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
// }
//-------------------

import { CustomError } from "../utils/ErrorHandler.js";

export function validReference(prop) {
  return async (req, res, next) => {
    try {
      const items = req.body[`${prop}s`];

      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new CustomError(
          `Request body must contain a non-empty '${prop}s' array.`,
          400,
          "in validReference middleware"
        );
      }

      let modal;
      if (prop === "product") {
        modal = Products;
      } else if (prop === "order") {
        modal = Orders;
      } else {
        throw new CustomError(
          `Invalid reference type: ${prop}`,
          500,
          "in validReference middleware"
        );
      }
      let errorStr = [];

      for (const [i, value] of items.entries()) {
        const idToValidate = value[prop];
        if (!idToValidate || !mongoose.Types.ObjectId.isValid(idToValidate)) {
          errorStr.push(
            `(${i + 1}) Invalid or missing ${prop} ID at position 👉 ${i + 1}.`
          );
        }
        const foundDoc = await new modal().showOne(idToValidate);

        if (!foundDoc) {
          errorStr.push(
            `(${i + 1}) ${prop} with ID ${idToValidate} at position ${
              i + 1
            } has no reference.`
          );
        }
      }

      if (errorStr.length > 0) {
        throw new CustomError(errorStr, 404, "in validReference middleware");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
