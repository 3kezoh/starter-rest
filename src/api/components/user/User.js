/* eslint-disable no-param-reassign */

/**
 * Module dependencies
 */

const { hash, compare } = require("bcryptjs");
const { Schema, model, models } = require("mongoose");
const { sign } = require("jsonwebtoken");
const { jwtSecret, jwtExpiration } = require("../../../config/globals");

/**
 * User roles.
 */

const roles = ["user", "admin"];

/**
 * User schema definition.
 * @private
 */

const userSchema = new Schema(
  {
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 128,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 32,
    },

    role: {
      type: String,
      enum: roles,
      default: "user",
    },
  },
  { timestamps: true }
);

/**
 * Hide _v field for every toObject() calls.
 */

userSchema.set("toObject", { versionKey: false });

/**
 * Transform
 */

userSchema.options.toObject.transform = function transform(doc, ret) {
  delete ret.password;
  delete ret.updatedAt;
  return ret;
};

/**
 * Pre-save hook for password hash.
 */

userSchema.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();
    const hashedPassword = await hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});

/**
 * Methods.
 */

userSchema.method({
  token() {
    const payload = { sub: this._id };
    const jwtOptions = { expiresIn: jwtExpiration };
    return sign(payload, jwtSecret, jwtOptions);
  },
  async passwordMatches(candidatePassword) {
    return compare(candidatePassword, this.password);
  },
});

/**
 * Statics
 */

userSchema.statics.roles = roles;

/**
 * @typedef User
 */

const User = models.User || model("User", userSchema);

module.exports = User;
