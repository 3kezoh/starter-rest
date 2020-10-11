/**
 * User model.
 */

const User = require("./User");

/**
 * Create a new user.
 * @async
 * @param {string} email
 * @param {string} password
 * @public
 */

exports.create = async (email, password, name, role = "user") =>
  User.create({ email, password, name, role });

/**
 * Find a new user by id
 * @async
 * @param {string} _id
 * @public
 */

exports.find = async (_id) => User.findById(_id).exec();

/**
 * Find a user by email
 * @async
 * @param {string} email
 * @public
 */

exports.findByEmail = async (email) => {
  return User.findOne({ email }).exec();
};

/**
 * Find a user by name
 * @async
 * @param {string} name
 * @public
 */

exports.findByName = async (name) => {
  return User.findOne({ name }).exec();
};

/**
 * Find all users.
 * @async
 * @public
 */

exports.list = async () => User.find().exec();

/**
 * Update a user by id.
 * @async
 * @param {string} _id
 * @param {object} update
 * @public
 */

exports.update = async (_id, update) =>
  User.findByIdAndUpdate(_id, update).exec();

/**
 * Delete a user by id.
 * @async
 * @param {string} _id
 * @public
 */

exports.delete = async (_id) => User.findByIdAndDelete(_id);
