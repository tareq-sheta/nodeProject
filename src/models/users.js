// import { callDB } from "../DB_connect";
import mongoose from "mongoose";
import { CustomError } from "../utils/ErrorHandler.js";
import { hash, genSalt } from "bcrypt";

// export type Order_Type = {
//   id: number;
//   /* prdctsID_in_order: number; */
//   quantity_in_order: number;
//   user_id: number;
//   status_of_order: string;
// };
let usersSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      minLength: 5,
      message: "A user must have at least 5 characters.",
    },
    password: {
      type: String,
      required: true,
      message: "A user must have at least one password.",
    },
    rule: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
      message: "A user must have avalid rule.[user,seller,admin]",
    },
  },
  {
    timestamps: true,
  }
);
// /*
//  *
//  *
//  *
//  */
// ----------------------------------------
// ----------------------------------------
// ----------------------------------------

usersSchema.pre("save", async function (next) {
  // //console.log(this, "_____save users_____1");
  const salt = await genSalt(10);
  let hashedPassword = await hash(this.password, salt);
  this.password = hashedPassword;
  //console.log(this, "after pre save");
  next();
});
usersSchema.pre("findOneAndUpdate", async function (next) {
  // //console.log("_____save users_____2");
  // //console.log(this);
  const update = this.getUpdate();
  if (update.password) {
    const salt = await genSalt(10);
    update.password = await hash(update.password, salt);
  }
  //console.log(update, "after pre findOneAndUpdate");
  next();
});
let usersModel = mongoose.model("Users", usersSchema);
// export let usersModel = mongoose.model("Users", usersSchema);
class Users {
  async showAll() {
    try {
      const Response = await usersModel.find();
      return Response;
    } catch (error) {
      throw new CustomError(
        `index methode in order controller didnt work2 ${Object.keys(error)}`,
        404,
        "in users showAll model"
      );
    }
  }

  async showOne(query) {
    try {
      //console.log(query, "inside showOne model");
      // const [Response] = await usersModel.find(query);
      const [Response] = await usersModel.find(query);

      //console.log(Response, "afterResponse in showOne model");
      if (!Response) {
        return null;
      }
      return Response;
    } catch (err) {
      throw new CustomError(
        `Could not find the Order with query = ${query}. Error: ${err}`,
        404,
        "in users showOne model"
      );
    }
  }

  async create(obj) {
    try {
      const Response = await usersModel.create(obj);
      //console.log(Response, "afterResponse in create model");
      return Response;
    } catch (err) {
      throw new CustomError(
        "failed to create new user",
        400,
        "in users create model"
      );
    }
  }

  async delete(id) {
    try {
      //console.log(id, "inside delete model");
      const Response = await usersModel.findByIdAndDelete({ _id: id });
      //console.log(Response, "afterResponse in delete model");
      return Response;
    } catch (err) {
      throw new CustomError(
        "failed to delete user",
        400,
        "in users delete model"
      );
    }
  }

  async update(obj) {
    try {
      const Response = await usersModel.findOneAndUpdate(
        { _id: obj._id },
        obj,
        {
          new: true,
          runValidators: true,
        }
      );
      //console.log(Response, "afterResponse in update model");
      return Response;
    } catch (err) {
      throw new CustomError(
        "failed to update user",
        400,
        "in users update model"
      );
    }
  }
}

export default Users;
