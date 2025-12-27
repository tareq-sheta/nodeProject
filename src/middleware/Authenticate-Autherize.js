import bcrypt, { genSalt } from "bcrypt";
// import { callDB } from "../DB_connect";
// import { User_type } from "../models/users";
// import { Product_Type } from "../models/products";
// import { Order_Type } from "../models/orders";
// import express from "express";
// mongoose

import jwt from "jsonwebtoken";
import findOne from "mongoose";
import Users from "../models/users.js";
import { CustomError } from "../utils/ErrorHandler.js";
// import JwtPayload from "jsonwebtoken";

/* let authenticateUser =async (userName:string,password:string):Promise<User_type|null> => {
   let connct = await callDB.connect();


  } */

export let hasher = (usrPsswrd) => {
  let salt = genSalt(10);
  let hashedPassword = bcrypt.hashSync(usrPsswrd, parseInt(salt));
  return hashedPassword;
};

/* let hashedPassword:string = bcrypt.hashSync(
    user_password as string + mypepper as string,
    parseInt(salt_rounds as string) */
//   );
// export async function authenticateUser(
//   userName,
//   password
// ) {
//   try {

//     // let userPassword = password.split(' ')[1]

//     const used_sql = "SELECT * FROM users WHERE firstname=($1)";

//     const cnct_to_db = await callDB.connect();

//     const DBResponse = await cnct_to_db.query(used_sql, [userName]);
//     cnct_to_db.release();
//     if (DBResponse.rows.length) {
//       let userData = DBResponse.rows[0];
//       if (bcrypt.compareSync(password + process.env.mypepper, userData.password)/*  && userData.first_name===userName */) {
//         // //console.log()
//         return userData;
//       }
//     }
//     return null;
//   } catch (err) {
//     throw new Error(
//     //   `Could not find the user with id = ${userName}. Error: ${err}`
//     `access denied to user (authenticateUser):${userName}:${(err as Error).message}`
//     );
//   }
// }
export async function authenticateUser(userName, password) {
  try {
    // let userPassword = password.split(' ')[1]

    // const used_sql = "SELECT * FROM users WHERE firstname=($1)";

    // const cnct_to_db = await callDB.connect();

    // const DBResponse = await cnct_to_db.query(used_sql, [userName]);
    //console.log(userName, password);
    let oneuser = await new Users().showOne({ username: userName });
    //console.log(oneuser, "oneuser authenticateUser");
    //console.log(
    //   bcrypt.compareSync(password, oneuser.password),
    //   "bcrypt.compareSync authenticateUser"
    // );

    if (oneuser) {
      // let userData = DBResponse.rows[0];
      if (
        bcrypt.compareSync(
          password,
          oneuser.password
        ) /*  && userData.first_name===userName */
      ) {
        // //console.log()
        return oneuser;
      }
    }
    return null;
  } catch (err) {
    // throw new Error(
    //   //   `Could not find the user with id = ${userName}. Error: ${err}`
    //   ` (authenticateUser):${userName}:${err.message}`
    // );
    throw new CustomError(
      "access denied to user",
      403,
      "in authenticateUser middleware"
    );
  }
}

// export function AuthorizeUser(...roles) {
//   const defaultRoles = ["user", "seller", "admin"];
//   const finalRoles = [...roles, ...defaultRoles];
//   return (req, res, next) => {
//     try {
//       const { authorization: token } = req.headers; // Assuming you're now using 'authorization' directly

//       if (!token) {
//         throw new CustomError(
//           "Authorization token is missing.",
//           401, // Use 401 for a missing token
//           "in AuthorizeUser middleware"
//         );
//       }

//       // Since you're not using 'Bearer', the header value is the token itself.
//       // const token = authorization;

//       // The jwt.verify() method will throw an error if the token is invalid or expired.
//       // This removes the need for a separate if/else block.
//       const decodedToken = jwt.verify(token, process.env.tokenSecret);
//       //console.log(decodedToken, "decodedToken\n\n\n");

//       if (!finalRoles.includes(decodedToken.role)) {
//         throw new CustomError(
//           "Unauthorized access.",
//           403,
//           "in AuthorizeUser middleware"
//         );
//       }

//       req.currentUser = decodedToken;
//       next();
//     } catch (err) {
//       // Check for specific JWT errors and provide a client-friendly message
//       if (err instanceof jwt.JsonWebTokenError) {
//         next(
//           new CustomError(
//             "Invalid or expired token.",
//             401,
//             "in AuthorizeUser middleware"
//           )
//         );
//       } else {
//         // For all other errors, pass the original error to the global controller.
//         next(err);
//       }
//     }
//   };
// }

// export function AuthorizeUser(req, res, next) {
//   try {
//     const { authorization: token } = req.headers; // Assuming you're now using 'authorization' directly

//     if (!token) {
//       throw new CustomError(
//         "Authorization token is missing.",
//         401, // Use 401 for a missing token
//         "in AuthorizeUser middleware"
//       );
//     }

//     // Since you're not using 'Bearer', the header value is the token itself.
//     // const token = authorization;

//     // The jwt.verify() method will throw an error if the token is invalid or expired.
//     // This removes the need for a separate if/else block.
//     const decodedToken = jwt.verify(token, process.env.tokenSecret);
//     //console.log(decodedToken, "decodedToken\n\n\n");
//     req.currentUser = decodedToken;
//     next();
//   } catch (err) {
//     // Check for specific JWT errors and provide a client-friendly message
//     if (err instanceof jwt.JsonWebTokenError) {
//       next(
//         new CustomError(
//           "Invalid or expired token.",
//           401,
//           "in AuthorizeUser middleware"
//         )
//       );
//     } else {
//       // For all other errors, pass the original error to the global controller.
//       next(err);
//     }
//   }
// }
export function AuthorizeUser(...roles) {
  const authorizedRoles =
    roles.length > 0 ? roles : ["user", "seller", "admin"];
  // console.log(authorizedRoles, "authorizedRoles");
  return (req, res, next) => {
    try {
      // The token is sent directly in the authorization header
      const token = req.headers.authorization;

      if (!token) {
        throw new CustomError(
          "Authorization token is missing.",
          401,
          "in AuthorizeUser middleware"
        );
      }

      // Verify the token directly without slicing the 'Bearer ' prefix
      const decodedToken = jwt.verify(token, process.env.tokenSecret);
      // Authorization check
      console.log(decodedToken, "decodedToken");
      if (!authorizedRoles.includes(decodedToken.loggingUser.rule)) {
        throw new CustomError(
          "You are not authorized to access this resource.",
          403,
          "in AuthorizeUser middleware"
        );
      }

      req.currentUser = decodedToken.loggingUser;
      next();
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        next(
          new CustomError(
            "Invalid or expired token.",
            401,
            "in AuthorizeUser middleware"
          )
        );
      } else {
        next(err);
      }
    }
  };
}
