import { CustomError } from "../utils/ErrorHandler.js";
import mongoose from "mongoose";

function sameUserRestrictUsers(req, res, next) {
  console.log(req.currentUser, "sameUserRestrictUsers middleware");
  if (req.currentUser.rule !== "admin") {
    let isSameUser = req.currentUser._id === req.params.id;
    console.log(isSameUser, "isSameUser");
    if (!isSameUser) {
      throw new CustomError(
        "only admin can update data of other users",
        404,
        "sameUserRestrictUsers middleware"
      );
    }
  }

  next();
}
export default sameUserRestrictUsers;
// function sameUserRestrict(req, res, next) {
//   const resourceId = req.params.id; // Or req.params.userId, depending on your route
//   const currentUserId = req.currentUser._id.toString();

//   // Admin users can access anything, so let them through.
//   if (req.currentUser.role === "admin") {
//     return next();
//   }

//   // Now, compare the requested resource's ID with the current user's ID.
//   // This is the core ownership check.
//   if (resourceId !== currentUserId) {
//     throw new CustomError(
//       "You are not authorized to access this resource.",
//       403, // Use 403 Forbidden for a correct status code
//       "in sameUserRestrict middleware"
//     );
//   }

//   next();
// }
// export default sameUserRestrict;
