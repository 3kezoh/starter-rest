/**
 * Module dependencies.
 */

const { Schema, model, models } = require("mongoose");

/**
 * Post schema definition.
 * @private
 */

const postSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

/**
 * @typedef Post
 */

const Post = models.Post || model("Post", postSchema);

module.exports = Post;
