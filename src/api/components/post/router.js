/**
 * Module dependencies.
 */

const { Router } = require("express");
const { authenticate } = require("../../middlewares/auth");

/**
 * controllers.
 */

const postController = require("./controller");

/**
 * Validations.
 */

const createValidation = require("./validation/create");

const router = Router();

router
  .route("/")

  /**
   * @api {post} /post
   * @apiDescription Create a new post.
   * @apiVersion 1.0.0
   * @apiName Create
   * @apiGroup Post
   * @apiPermission public
   *
   * @apiParam {String} author
   *
   * @apiSuccess {String} _id
   * @apiSuccess {String} author
   * @apiSuccess {Date} createdAt
   *
   * @apiError (401 Unauthorized) Unauthorized Only authenticated users can access the data
   * @apiError (404 Not Found) NotFound Author does not exist
   * @apiError (422 Unprocessable Entity) ValidationError Some parameters may contain invalid values
   */

  .post(authenticate, createValidation, postController.create);

module.exports = router;
