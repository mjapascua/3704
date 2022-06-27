const path = require("path");
const express = require("express");
const dotenv = require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const colors = require("colors");
//const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");
const port = process.env.PORT || 5000;
const connectDB = require("./config/db");

connectDB();

const app = express();

/* var corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
}; */
//app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/public", require("./routes/publicRoutes"));

app.use("/api/bulletin", require("./routes/bulletinRoutes"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../", "client", "build", "index.html")
    );
  });
} else {
  app.get("/", (req, res) => {
    res.send("Development environment");
  });
}

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
