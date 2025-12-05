import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a report name"],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please provide a category"],
    },
    status: {
      type: String,
      required: [true, "Please provide a status"],
      enum: ["completed", "in-progress", "not-started", "testing", "verified", "failed-testing"],
      default: "not-started",
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
    updatedBy: {
      type: String,
      default: 'System'
    },
  },
  {
    timestamps: true,
  },
);

// Prevent overwriting the model if it's already compiled
export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
