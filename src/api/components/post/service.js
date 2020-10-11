/**
 * Post model.
 */

const Post = require("./Post");

/**
 * Create a new post.
 * @async
 * @param {string} author
 * @public
 */

exports.create = async (userId) => {
  Post.create({ author: userId });
};
