const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");



// ✅ Load environment variables
dotenv.config();

const app = express();

// ✅ Security Middleware
app.use(helmet());

// ✅ Improved Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 500, // Allow more requests
  message: "⚠️ Too many requests. Please try again later.",
});
app.use(limiter);
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// ✅ CORS Middleware (Allow Multiple Frontends)
const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle CORS Preflight Requests
app.options("*", cors());

// ✅ Body Parser Middleware
app.use(express.json());

// ✅ MongoDB Connection with Error Handling
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ ERROR: Missing MONGO_URI in .env file");
  process.exit(1);
}

// ✅ Fix strictPopulate Issue
mongoose.set("strictPopulate", false);

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Exit server if DB fails
  });

// ✅ Import Routes with Error Handling
const routeFiles = [
  { path: "/api/auth", file: "./routes/authRoutes" },
  { path: "/api/users", file: "./routes/userRoutes" },
  { path: "/api/courses", file: "./routes/courseRoutes" },
  { path: "/api/assignments", file: "./routes/assignmentRoutes" },
  { path: "/api/notifications", file: "./routes/notifications" },
  { path: "/api/teachers", file: "./routes/teacherRoutes" },
  { path: "/api/admin", file: "./routes/adminRoutes" },
  { path: "/api/performance", file: "./routes/performanceRoutes" },
  { path: "/api/students", file: "./routes/studentRoutes" },
  { path: "/api/enrollments", file: "./routes/enrollmentRoutes" },
  { path: "/api/reports", file: "./routes/reports" },
  { path: "/api/live-classes", file: "./routes/liveClasses" },
  { path: "/api/submissions", file: "./routes/submissions" },
  { path: "/api/community", file: "./routes/communityRoutes" },
  { path: "/api/instructor", file: "./routes/instructorRoutes"},
  { path: "/api/assignment-submissions", file:"./routes/assignmnetSubmissionRoutes"},
  { path: "/api/grades" , file: "./routes/gradeRoutes" },
  { path: "/api/holidays" , file: "./routes/holidays"},
  { path: "/api/discussionRoutes", file: "./routes/discussionRoutes"},
  

];



routeFiles.forEach(({ path, file }) => {
  try {
    app.use(path, require(file));
    console.log(`✅ Route Loaded: ${path}`);
  } catch (err) {
    console.error(`❌ Error loading route ${path}:`, err.message);
  }
});

// ✅ Default API Route
app.get("/", (req, res) => {
  res.send("🚀 Welcome to GNDUmoodle Backend API!");
});

// ✅ Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// ✅ Handle 404 for Undefined Routes
app.use((req, res) => {
  res.status(404).json({ error: "❌ Route not found" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
