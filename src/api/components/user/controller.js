/**
 * Module dependencies
 */

const { StatusCodes } = require("http-status-codes");
const { isValidObjectId } = require("mongoose");
const APIError = require("../../utils/APIError");
const userService = require("./service");
const { EMAIL_USED } = require("../../utils/ErrorMessages");

/**
 * Handle request with _id parameter
 * @async
 * @public
 * @route ALL /user/:_id
 */

exports.load = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params._id)) {
      throw new APIError({
        message: "user _id is invalid",
        status: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }
    const userDocument = await userService.find(req.params._id);
    if (!userDocument) {
      throw new APIError({
        message: "User does not exist",
        status: StatusCodes.NOT_FOUND,
      });
    }
    req.locals = { userDocument };
    return next();
  } catch (err) {
    return next(err);
  }
};

/**
 * Get all users
 * @async
 * @public
 * @admin
 * @route GET /user
 */

exports.list = async (req, res, next) => {
  try {
    const userDocuments = await userService.list();
    const users = userDocuments.map((userDocument) => userDocument.toObject());
    res.status(StatusCodes.OK);
    return res.json(users);
  } catch (err) {
    return next(err);
  }
};

/**
 * Get logged in user info
 * @async
 * @public
 * @route GET /user/profile
 */

exports.loggedIn = async (req, res, next) => {
  try {
    return res.json(req.user.toObject());
  } catch (err) {
    return next(err);
  }
};

/**
 * Create a new user.
 * @async
 * @public
 * @admin
 * @route POST /user
 */

exports.create = async ({ body }, res, next) => {
  try {
    const { email, password, name, role } = body;
    const existingUserDocument = await userService.findByEmail(email);
    if (existingUserDocument) {
      throw new APIError({
        message: EMAIL_USED,
        status: StatusCodes.UNPROCESSABLE_ENTITY,
      });
    }
    const userDocument = await userService.create(email, password, name, role);
    const user = userDocument.toObject();
    res.status(StatusCodes.CREATED);
    return res.json({ message: "User created", user });
  } catch (err) {
    return next(err);
  }
};

/**
 * Update a user.
 * @async
 * @public
 * @route PUT /user/:_id
 */

exports.update = async ({ body, locals: { userDocument } }, res, next) => {
  try {
    const { name } = body;
    const outdatedUserDocument = await userService.update(userDocument._id, {
      name,
    });
    const outdatedUser = outdatedUserDocument.toObject();
    res.status(StatusCodes.OK);
    return res.json({ message: "User updated", outdatedUser });
  } catch (err) {
    return next(err);
  }
};

/**
 * Delete user account
 * @async
 * @public
 * @route DELETE /user/:_id
 */

exports.delete = async ({ params }, res, next) => {
  try {
    const { _id, email, name } = await userService.delete(params._id);
    res.status(StatusCodes.OK);
    return res.json({
      message: "User deleted",
      deletedUser: { _id, email, name },
    });
  } catch (err) {
    return next(err);
  }
};
