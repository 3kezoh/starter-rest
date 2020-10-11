/* eslint-disable no-use-before-define */

/**
 * Module dependencies
 */

const { Schema, model, models } = require("mongoose");
const { randomBytes } = require("crypto");
const { refreshTokenExpiration } = require("../../../config/globals");

/**
 * Refresh token schema definition.
 * @private
 */

const refreshTokenSchema = new Schema({
  value: {
    type: String,
    required: true,
    index: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiresIn: {
    type: Date,
    required: true,
  },
});

/**
 * Statics.
 */

refreshTokenSchema.statics = {
  /**
   * Generate a refresh token object and saves it into the database
   * @param {String} _id User _id
   * @returns {RefreshToken}
   */

  async generate(_id) {
    await RefreshToken.findOneAndRemove({ user: _id });
    const value = `${_id}.${randomBytes(30).toString("hex")}`;
    const expiresIn = new Date(Date.now() + refreshTokenExpiration);
    const refreshToken = await RefreshToken.create({
      value,
      user: _id,
      expiresIn,
    });
    return refreshToken.value;
  },
};

const RefreshToken =
  models.RefreshToken || model("RefreshToken", refreshTokenSchema);

module.exports = RefreshToken;
