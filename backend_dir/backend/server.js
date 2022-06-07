const express = require("express");
const colors = require("colors");
const cors = require("cors");
const dotenv = require("dotenv");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;

dotenv.config();
connectDB();

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/public", require("./routes/publicRoutes"));

app.use("/api/bulletin", require("./routes/bulletinRoutes"));

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
