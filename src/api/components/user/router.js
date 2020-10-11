/**
 * Module dependencies.
 */
const { Router } = require("express");
const { authenticate, authorize } = require("../../middlewares/auth");

/**
 * Controllers.
 */

const userController = require("./controller");

/**
 * Validations.
 */

const updateValidation = require("./validation/update");
const createValidation = require("./validation/create");

/**
 * Create router.
 */

const router = Router();

/**
 * @route /user
 */

router
  .route("/")

  /**
   * @api {get} /user
   * @apiDescription Get all users
   * @apiVersion 1.0.0
   * @apiName List
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization Access token
   *
   * @apiSuccess {Object[]} users List of users
   *
   * @apiError (401 Unauthorized) Unauthorized Only authenticated users can access the data
   * @apiError (403 Forbidden) Forbidden Only admins can access the data
   */

  .get(authenticate, authorize, userController.list)

  /**
   * @api {post} /user
   * @apiDescription Create a new user.
   * @apiVersion 1.0.0
   * @apiName Create
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization Access token
   *
   * @apiParam {String} email
   * @apiParam {String} password
   * @apiParam {String} confirmPassword
   * @apiParam {String} role
   *
   * @apiSuccess {String} _id
   * @apiSuccess {String} email
   * @apiSuccess {String} name
   * @apiSuccess {Date} createdAt
   *
   * @apiError (401 Unauthorized) Unauthorized Only authenticated users can access the data
   * @apiError (403 Forbidden) Forbidden Only admins can access the data
   * @apiError (422 Unprocessable Entity) ValidationError Some parameters may contain invalid values
   */

  .post(authenticate, authorize, createValidation, userController.create);

/**
 * @route /user/profile
 */

router
  .route("/profile")

  /**
   * @api {get} /user/profile
   * @apiDescription Get logged in user profile information
   * @apiVersion 1.0.0
   * @apiName UserProfile
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Authorization Access token
   *
   * @apiSuccess {String} _id
   * @apiSuccess {String} email
   * @apiSuccess {String} name
   * @apiSuccess {String} role
   * @apiSuccess {Date} createdAt
   *
   * @apiError (401 Unauthorized) Only authenticated users can access the data
   */

  .get(authenticate, userController.loggedIn);

/**
 * Handle request with _id parameter
 */

router.param("_id", userController.load);

/**
 * @route /user/:_id
 */

router
  .route("/:_id")

  /**
   * @api {put} /user/:_id
   * @apiDescription Update user information
   * @apiVersion 1.0.0
   * @apiName Update
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Authorization Access token
   *
   * @apiParam {String} _id
   * @apiParam {String} name
   *
   * @apiSuccess {String} name Outdated user's name
   *
   * @apiError (401 Unauthorized) Unauthorized Only authenticated users can update the data
   * @apiError (403 Forbidden) Forbidden Only user with same id or admins can update the data
   * @apiError (404 Not Found) NotFound User does not exist
   * @apiError (422 Unprocessable Entity) UnprocessableEntity _id is invalid
   * @apiError (422 Unprocessable Entity) ValidationErrors Some parameters may contain invalid values
   */

  .put(authenticate, authorize, updateValidation, userController.update)

  /**
   * @api {delete} /user/:_id
   * @apiDescription Delete logged in user
   * @apiVersion 1.0.0
   * @apiName Delete
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Authorization Access token
   *
   * @apiParam {String} _id
   *
   * @apiSuccess {String} _id Deleted user's _id
   * @apiSuccess {String} email Deleted user's email
   * @apiSuccess {String} name Deleted user's name
   *
   *
   * @apiError (401 Unauthorized) Unauthorized Only authenticated users can access the data
   * @apiError (403 Forbidden) Forbidden Only user with same id or admins can delete the data
   * @apiError (404 Not Found) NotFound User does not exist
   * @apiError (422 Unprocessable Entity) UnprocessableEntity _id is invalid
   */

  .delete(authenticate, authorize, userController.delete);

module.exports = router;
