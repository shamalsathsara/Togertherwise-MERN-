const mongoose = require("mongoose");
const Project = require("./models/Project");
const Donation = require("./models/Donation");

const MONGODB_URI = "mongodb://localhost:27017/togetherwise";

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing dummy data if necessary (optional)
    await Project.deleteMany({ title: "Test Water Project" });

    // Create a new Project
    const project1 = await Project.create({
      title: "Test Water Project",
      description: "A test project for clean water.",
      shortDescription: "Clean water test.",
      goal: 50000,
      currentFunds: 15400, // Will show up in aggregation!
      status: "active",
      category: "Water Projects",
    });

    const project2 = await Project.create({
      title: "Test Reforestation Project",
      description: "A test project for planting trees.",
      shortDescription: "Tree planting test.",
      goal: 20000,
      currentFunds: 4200, 
      status: "active",
      category: "Reforestation",
    });

    // Create a test Donation to simulate total income
    await Donation.create({
      amount: 15400,
      donorName: "Alice Smith",
      donorEmail: "alice@example.com",
      projectId: project1._id,
      paymentMethod: "manual",
      paymentStatus: "completed",
    });

    await Donation.create({
      amount: 4200,
      donorName: "Bob Johnson",
      donorEmail: "bob@example.com",
      projectId: project2._id,
      paymentMethod: "manual",
      paymentStatus: "completed",
    });

    console.log("Dummy data successfully seeded!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
