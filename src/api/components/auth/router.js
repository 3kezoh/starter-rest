/**
 * Module dependencies.
 */

const { Router } = require("express");

/**
 * Controllers.
 */

const authController = require("./controller");

/**
 * Validations.
 */

const signupValidation = require("./validation/signup");
const loginValidation = require("./validation/login");
const resetPasswordValidation = require("./validation/resetPassword");
const refreshValidation = require("./validation/refresh");
const sendPasswordResetValidation = require("./validation/sendPasswordReset");

const router = Router();

/**
 * @api {post} /auth/signup
 * @apiDescription Create a new user account
 * @apiVersion 1.0.0
 * @apiName Signup
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam {String} email
 * @apiParam {String} password
 * @apiParam {String} confirmPassword
 *
 * @apiSuccess (200 Ok) token Authorization token
 *
 * @apiError (422 Unprocessable Entity) ValidationError Some parameters may contain invalid values
 */

router.post("/signup", signupValidation, authController.signup);

/**
 * @api {post} /auth/login
 * @apiDescription Sign in user
 * @apiVersion 1.0.0
 * @apiName Login
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam {String} email
 * @apiParam {String} password
 *
 * @apiSuccess (200 Ok) token Authorization token
 *
 * @apiError (404 Not Found) NotFound User does not exist
 * @apiError (422 Unprocessable Entity) ValidationError Some parameters may contain invalid values
 */

router.post("/login", loginValidation, authController.login);

/**
 * @api {post} /auth/refresh-token
 * @apiDescription Refresh expired accessToken
 * @apiVersion 1.0.0
 * @apiName RefreshToken
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam {String} refreshToken Refresh token acquired when user logged in
 *
 * @apiSuccess (200 Ok) token Authorization token
 *
 * @apiError (404 Not Found) NotFound Invalid refresh token
 * @apiError (422 Unprocessable Entity) ValidationError Some parameters may contain invalid values
 */

router.route("/refresh-token").post(refreshValidation, authController.refresh);

/**
 * @apiIgnore
 * @api {post} /auth/send-password-reset
 * @apiDescription Send a password reset token to the user
 * @apiVersion 1.0.0
 * @apiName SendPasswordReset
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam {String} email
 *
 * @apiSuccess (200 Ok) token Password reset token
 *
 * @apiError (404 Not Found) NotFound User does not exist
 * @apiError (422 Unprocessable Entity) ValidationError Some parameters may contain invalid values
 */

router
  .route("/send-password-reset")
  .post(sendPasswordResetValidation, authController.sendPasswordReset);

/**
 * @api {post} /auth/reset-password
 * @apiDescription Update a user password
 * @apiVersion 1.0.0
 * @apiName ResetPassword
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam {String} password
 * @apiParam {String} PasswordResetToken
 *
 * @apiSuccess (200 Ok) Message
 *
 * @apiError (404 Not Found) NotFound The password reset token is invalid
 * @apiError (422 Unprocessable Entity) ValidationError Some parameters may contain invalid values
 */

router
  .route("/reset-password")
  .post(resetPasswordValidation, authController.resetPassword);

module.exports = router;
