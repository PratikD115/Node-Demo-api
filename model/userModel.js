const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide you email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide the valid Email Adress"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please enter the Password!!"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, "Please enter the PasswordConfirm!!"],
    validate: {
      validator: function (cp) {
        return cp === this.password;
      },
      message: "Password should be match with confirm password",
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  //if the password is not modify then simply send to the next middleware
  if (!this.isModified("password")) return next();
  //if password is changed then encrypt it using the bcrypt package using the hash function
  //of the cost 12
  console.log("user password : " + this.password);
  this.password = await bcrypt.hash(this.password, 12);
  //before this function work it already check that the password and confirmpassword is same
  //and for that now we no longer use the confirmpassword for any reason
  //so we just remvoe it
  this.passwordConfirm = undefined;
  //now switch to the next middleware
  next();
});

// userSchema.methods.CP= async function (
//   candidatePassword,
//   userPassword
// ) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };
// it's a instance function for coparing the password is same or not
userSchema.methods.correctPassword = async function (
  candidatePasssword,
  userPassword
) {
  return await bcrypt.compare(candidatePasssword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
