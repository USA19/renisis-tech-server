import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    description: String,

    postedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    imageUrl: String,

    likes: [{
      likedBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      }
    }],

    comments: [{
      comment: String,
      commentedBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      date: {
        type: Date,
        default: new Date()
      }
    }],

  },

  {
    timestamps: true,
  }
);

export default mongoose.model("Post", postSchema);
