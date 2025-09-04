const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/User"); // Adjust the path if needed

// ✅ Replace this with your actual MongoDB connection string
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://ramneet:Jashanaus2005@cluster0.f3rm8.mongodb.net/crud?retryWrites=true&w=majority&appName=Cluster0";

async function resetPassword() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Set timeout to 5 seconds
    });

    console.log("✅ MongoDB Connected Successfully!");

    const email = "mkg111@gmail.com";  // Change this to the correct user
    const newPassword = "11111"; // Set a simple password for testing

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const user = await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (!user) {
      console.log("❌ User not found!");
    } else {
      console.log(`✅ Password reset successfully for: ${email}`);
    }
  } catch (err) {
    console.error("❌ Error resetting password:", err);
  } finally {
    mongoose.disconnect();
  }
}

resetPassword();
