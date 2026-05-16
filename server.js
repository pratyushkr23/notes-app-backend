const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const noteRoutes = require("./routes/noteRoutes");
const path = require("path");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", authRoutes);

app.get("/about", (req, res) => {
  res.json({
    name: "Pratyush Kumar",
    email: "pratyush9801@gmail.com",
    "my features": {
      "Note Sharing":
        "Users can securely share notes with other registered users using email-based sharing.",
    },
  });
});

app.get("/openapi.json", (req, res) => {
  res.json({
    openapi: "3.0.0",
    info: {
      title: "Notes App API",
      version: "1.0.0",
      description: "Backend API for multi-user notes application",
    },

    servers: [
      {
        url: "http://localhost:3001",
      },
    ],

    paths: {
      "/register": {
        post: {
          summary: "Register new user",
        },
      },

      "/login": {
        post: {
          summary: "Login user",
        },
      },

      "/notes": {
        get: {
          summary: "Get all notes",
        },

        post: {
          summary: "Create note",
        },
      },

      "/notes/{id}": {
        get: {
          summary: "Get single note",
        },

        put: {
          summary: "Update note",
        },

        delete: {
          summary: "Delete note",
        },
      },

      "/notes/{id}/share": {
        post: {
          summary: "Share note",
        },
      },

      "/about": {
        get: {
          summary: "About developer",
        },
      },
    },
  });
});

app.use("/", noteRoutes);

app.get("/", (req, res) => {
  res.send("Notes API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});