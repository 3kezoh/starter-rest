/* eslint-disable no-use-before-define */

/**
 * Module dependencies
 */

const { Schema, model, models } = require("mongoose");
const { randomBytes } = require("crypto");
const { passwordResetTokenExpiration } = require("../../../config/globals");

/**
 * Password reset token schema definition.
 * @private
 */

const passwordResetTokenSchema = new Schema({
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

passwordResetTokenSchema.statics = {
  /**
   * Generate a password reset token object and saves it into the database
   * @param {String} _id User _id
   * @returns {PasswordResetToken}
   */

  async generate(_id) {
    await PasswordResetToken.findOneAndRemove({ user: _id });
    const value = `${_id}.${randomBytes(30).toString("hex")}`;
    const expiresIn = new Date(Date.now() + passwordResetTokenExpiration);
    const passwordResetToken = await PasswordResetToken.create({
      value,
      user: _id,
      expiresIn,
    });
    return passwordResetToken.value;
  },
};

const PasswordResetToken =
  models.PasswordResetToken ||
  model("PasswordResetToken", passwordResetTokenSchema);

module.exports = PasswordResetToken;
