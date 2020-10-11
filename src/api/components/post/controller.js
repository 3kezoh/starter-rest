/**
 * Module dependencies.
 */

const { StatusCodes } = require("http-status-codes");
const APIError = require("../../utils/APIError");
const userService = require("../user/service");
const ErrorMessages = require("../../utils/ErrorMessages");

/**
 * Services
 */

const postService = require("./service");

exports.create = async ({ body }, res, next) => {
  try {
    const { author } = body;
    const authorDocument = await userService.findByName(author);
    if (!authorDocument) {
      throw new APIError({
        message: ErrorMessages.USER_NOT_FOUND,
        status: StatusCodes.NOT_FOUND,
      });
    }
    console.log(res);
    const postDocument = await postService.create(authorDocument._id);
    res.status(StatusCodes.CREATED);
    return res.json({ message: "Post created", postDocument });
  } catch (err) {
    return next(err);
  }
};
