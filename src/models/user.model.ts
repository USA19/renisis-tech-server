import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    password: String,
    gender: String,
    username: String,

    email: {
      type: String,
      required: true,
    },

    resetToken: String,
    resetTokenExpiration: Date,

    profileImageUrl: {
      type: String,
      default: "images/default.png",
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
