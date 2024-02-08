const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;


mongoose
  .connect(process.env.DATABASE_URL)
  .then(console.log("DB Connected Successfully"))
  .catch((error) => {
    console.log(error)
    console.log("DB Facing Connection Issues");
    console.log(error);
    process.exit(1);
  });

const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name,email,password)

    const existingUser = await registration.findOne({ email: email });
    if (!existingUser) {
      const registrationData = new registration({
        name,
        email,
        password,
      });
      await registrationData.save();
      res.redirect("/success");
    } else {
      console.log("User alreadyexist");
      res.redirect("/error");
    }
  } catch (error) {
    console.log(error);
    res.redirect("error");
  }
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/pages/success.html");
});
app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/pages/error.html");
});
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
