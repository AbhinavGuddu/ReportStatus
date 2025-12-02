import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a category name"],
      trim: true,
    },
    environment: {
      type: String,
      required: [true, "Please provide an environment"],
      enum: ["aws", "dc"],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent overwriting the model if it's already compiled
export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
