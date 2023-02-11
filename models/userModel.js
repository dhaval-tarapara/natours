const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const { default: isEmail } = require("validator/lib/isemail");

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Please tell us tour name!"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please provide a valid email"],
  },
  profilePic: String,
  password: {
    type: String,
    trim: true,
    required: [true, "Please provide a password"],
    minLength: [8, "Password must be minimum 8 character long"],
    maxLength: [32, "Password must be shorter than 32 character"],
    select: false,
  },
  cPassword: {
    type: String,
    trim: true,
    required: [true, "Please confirm your password"],
    validate: {
      // this only works on CREATE & SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
    minLength: [8, "Password must be minimum 8 character long"],
    maxLength: [32, "Password must be shorter than 32 character"],
  },
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete cPassword field
  this.cPassword = undefined;

  next();
});

userSchema.methods.isPasswordCorrect = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = model("User", userSchema);

module.exports = User;
