const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const port = 8000;
app.listen(port, "127.0.0.1", () => {
  console.log(`listening in the port ${port}`);
});

mongoose
  .connect(
    "mongodb+srv://pratikdholariya97255:pratikd98@first.vbo74bs.mongodb.net/"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

