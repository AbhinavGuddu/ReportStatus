const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Load environment variables manually since we're running a script
// In a real scenario, use dotenv, but for simplicity we'll use the hardcoded string or read from .env.local
// For this script, we'll assume local mongodb
const MONGODB_URI = "mongodb://localhost:27017/reports-dashboard";

// Define Schemas (copied from models to avoid module import issues in script)
const CategorySchema = new mongoose.Schema(
  {
    name: String,
    environment: String,
    order: Number,
  },
  { timestamps: true },
);

const ReportSchema = new mongoose.Schema(
  {
    name: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    status: String,
    environment: String,
    order: Number,
  },
  { timestamps: true },
);

const Category = mongoose.model("Category", CategorySchema);
const Report = mongoose.model("Report", ReportSchema);

async function migrateData() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected!");

    // Read data extraction file
    const dataPath = path.join(__dirname, "../../data-extraction.json");
    const rawData = fs.readFileSync(dataPath, "utf8");
    const data = JSON.parse(rawData);

    // Clear existing data
    console.log("Clearing existing data...");
    await Category.deleteMany({});
    await Report.deleteMany({});

    // Migrate AWS Data
    console.log("Migrating AWS/NextGen data...");
    const awsCategories = data.environments.aws.categories;
    for (const cat of awsCategories) {
      const newCat = await Category.create({
        name: cat.name,
        environment: "aws",
        order: cat.order,
      });

      for (const report of cat.reports) {
        await Report.create({
          name: report.name,
          category: newCat._id,
          status: report.status,
          environment: "aws",
          order: report.order,
        });
      }
    }

    // Migrate DC Data
    console.log("Migrating DC/Autopay data...");
    const dcCategories = data.environments.dc.categories;
    for (const cat of dcCategories) {
      const newCat = await Category.create({
        name: cat.name,
        environment: "dc",
        order: cat.order,
      });

      for (const report of cat.reports) {
        await Report.create({
          name: report.name,
          category: newCat._id,
          status: report.status,
          environment: "dc",
          order: report.order,
        });
      }
    }

    console.log("✨ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateData();
