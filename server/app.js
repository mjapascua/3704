const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = 5000;

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://HOASYS3704:sanamataposThesis0@hoasys-3704-0.wnlx8.mongodb.net/user_accountsDB", { useNewUrlParser: true }, { useUnifiedTopology: true });

//create a data schema
const adminSchema = {
  email: String,
  cellphone: String,
  password: String
}

const Account = mongoose.model("Admin", adminSchema);

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", function(req, res) {
  let newAccount = new Account({
    email: req.body.email,
    cellphone: req.body.cellphone,
    password: req.body.password
  });
  newAccount.save();
  res.redirect('/');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://navhoasys:hoadb1@mongodbcluster0.xg8xi.mongodb.net/MongoDBCluster0?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
