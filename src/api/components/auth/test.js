/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */

/**
 * Module dependencies
 */

const { expect } = require("chai");
const { randomBytes } = require("crypto");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const request = require("supertest");
const app = require("../../../config/express");
const mongoose = require("../../../config/mongoose");
const User = require("../user/User");
const RefreshToken = require("../refreshToken/RefreshToken");
const PasswordResetToken = require("../passwordResetToken/PasswordResetToken");
const SuccessMessages = require("../../utils/SuccessMessages");
const ErrorMessages = require("../../utils/ErrorMessages");

describe("Auth API", () => {
  let yami;
  let user;
  let userDocument;
  let refreshToken;
  let passwordResetToken;
  let expiredRefreshToken;
  let expiredPasswordResetToken;

  before(() => {
    mongoose.connect();
  });

  beforeEach(async () => {
    yami = {
      name: "yami",
      email: "yami@yami.com",
      password: "password",
      confirmPassword: "password",
    };
    user = {
      email: "user@user.com",
      password: "password",
      name: "User",
    };
    await RefreshToken.deleteMany({});
    await User.deleteMany({});
    await User.create(user);
    userDocument = await User.findOne({ email: user.email });
    refreshToken = await RefreshToken.generate(userDocument._id);
    expiredRefreshToken = await RefreshToken.create({
      value: `${userDocument._id}.${randomBytes(30).toString("hex")}`,
      user: userDocument._id,
      expiresIn: new Date(),
    });
    passwordResetToken = await PasswordResetToken.generate(userDocument._id);
    expiredPasswordResetToken = await PasswordResetToken.create({
      value: `${userDocument._id}.${randomBytes(30).toString("hex")}`,
      user: userDocument._id,
      expiresIn: new Date(),
    });
  });

  /**
   * @route /auth/signup
   */

  describe("POST /auth/signup", () => {
    it("should response 201 with an access token", async () => {
      const { body } = await request(app)
        .post("/auth/signup")
        .send(yami)
        .expect(StatusCodes.CREATED);
      expect(body.message).to.equal(SuccessMessages.SIGN_UP_SUCCESS);
      expect(body.token).to.be.an("string");
      expect(body.refreshToken).to.be.an("string");
    });

    it("should response 422 when email already exist", async () => {
      yami.email = user.email;
      const { body } = await request(app)
        .post("/auth/signup")
        .send(yami)
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal(ErrorMessages.EMAIL_USED);
    });

    it("should response 422 when password is too short", async () => {
      yami.password = "exodia";
      yami.confirmPassword = yami.password;
      const { body } = await request(app)
        .post("/auth/signup")
        .send(yami)
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal("Validation Error");
      expect(body.errors).to.be.an("array");
      expect(body.errors).to.have.lengthOf(1);
      expect(body.errors[0].field).to.equal("password");
      expect(body.errors[0].message).to.equal(ErrorMessages.PASSWORD_TOO_SHORT);
    });

    it("should response 422 when password is too long", async () => {
      yami.password = randomBytes(128).toString("hex");
      yami.confirmPassword = yami.password;
      const { body } = await request(app)
        .post("/auth/signup")
        .send(yami)
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal("Validation Error");
      expect(body.errors).to.be.an("array");
      expect(body.errors).to.have.lengthOf(1);
      expect(body.errors[0].field).to.equal("password");
      expect(body.errors[0].message).to.equal(ErrorMessages.PASSWORD_TOO_LONG);
    });

    it("should response 422 when password is not confirmed", async () => {
      yami.confirmPassword = "exodia";
      const { body } = await request(app)
        .post("/auth/signup")
        .send(yami)
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal("Validation Error");
      expect(body.errors).to.be.an("array");
      expect(body.errors).to.have.lengthOf(1);
      expect(body.errors[0].field).to.equal("confirmPassword");
      expect(body.errors[0].message).to.equal(ErrorMessages.PASSWORD_NOT_MATCH);
    });
  });

  /**
   * @route POST /auth/login
   */

  describe("POST /auth/login", () => {
    it("should response 200 with an access token", async () => {
      const { body } = await request(app).post("/auth/login").send(user).expect(StatusCodes.OK);
      expect(body.message).to.equal(SuccessMessages.LOG_IN_SUCCESS);
      expect(body.token).to.be.an("string");
      expect(body.refreshToken).to.be.an("string");
    });

    it("should response 404 when the email is not found", async () => {
      const { body } = await request(app)
        .post("/auth/login")
        .send(yami)
        .expect(StatusCodes.NOT_FOUND);
      expect(body.code).to.equal(StatusCodes.NOT_FOUND);
      expect(body.message).to.equal(ErrorMessages.EMAIL_NOT_FOUND(yami.email));
    });

    it("should response 422 when the email is invalid", async () => {
      user.email = "email";
      const { body } = await request(app)
        .post("/auth/login")
        .send(user)
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal("Validation Error");
      expect(body.errors).to.be.an("array");
      expect(body.errors).to.have.lengthOf(1);
      expect(body.errors[0].field).to.equal("email");
      expect(body.errors[0].message).to.equal(ErrorMessages.EMAIL_INVALID);
    });

    it("should response 422 when the password is empty", async () => {
      delete user.password;
      const { body } = await request(app)
        .post("/auth/login")
        .send(user)
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal("Validation Error");
      expect(body.errors).to.be.an("array");
      expect(body.errors).to.have.lengthOf(1);
      expect(body.errors[0].field).to.equal("password");
      expect(body.errors[0].message).to.equal(ErrorMessages.PASSWORD_EMPTY);
    });
  });

  /**
   * @route POST /auth/refresh-token
   */

  describe("POST /auth/refresh-token", () => {
    it("should response 200 with a new access token", async () => {
      const { body } = await request(app)
        .post("/auth/refresh-token")
        .send({ refreshToken })
        .expect(StatusCodes.OK);
      expect(body.token).to.be.an("string");
      expect(body.refreshToken).to.be.an("string");
    });

    it("should response 404 when the refresh token is invalid", async () => {
      const { body } = await request(app)
        .post("/auth/refresh-token")
        .send({ refreshToken: "invalid refresh token" })
        .expect(StatusCodes.NOT_FOUND);
      expect(body.code).to.equal(StatusCodes.NOT_FOUND);
      expect(body.message).to.equal("Please log in.");
    });

    it("should response 422 when the refresh token is not provided", async () => {
      const { body } = await request(app)
        .post("/auth/refresh-token")
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal("Validation Error");
      expect(body.errors).to.be.an("array");
      expect(body.errors).to.have.lengthOf(1);
      expect(body.errors[0].field).to.equal("refreshToken");
      expect(body.errors[0].message).to.equal(ErrorMessages.REFRESH_TOKEN_EMPTY);
    });

    it("should response 422 when the refresh token is expired", async () => {
      const { body } = await request(app)
        .post("/auth/refresh-token")
        .send({ refreshToken: expiredRefreshToken.value })
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal(ErrorMessages.REFRESH_TOKEN_EXPIRED);
    });
  });

  /**
   * @route POST /auth/send-password-reset
   */

  describe("POST /auth/send-password-reset", () => {
    it("should response 200 with a password reset token", async () => {
      const { body } = await request(app)
        .post("/auth/send-password-reset")
        .send({ email: user.email })
        .expect(StatusCodes.OK);
      expect(body.passwordResetToken).to.be.an("string");
    });

    it("should response 404 when the email is not found ", async () => {
      const { body } = await request(app)
        .post("/auth/send-password-reset")
        .send({ email: yami.email })
        .expect(StatusCodes.NOT_FOUND);
      expect(body.code).to.equal(StatusCodes.NOT_FOUND);
      expect(body.message).to.equal(ErrorMessages.EMAIL_NOT_FOUND(yami.email));
    });

    it("should response 422 when the email is invalid", async () => {
      const { body } = await request(app)
        .post("/auth/send-password-reset")
        .send({ email: "invalid email" })
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal("Validation Error");
      expect(body.errors).to.be.an("array");
      expect(body.errors).to.have.lengthOf(1);
      expect(body.errors[0].field).to.equal("email");
      expect(body.errors[0].message).to.equal(ErrorMessages.EMAIL_INVALID);
    });
  });

  /**
   * @route POST /auth/reset-password
   */

  describe("POST /auth/reset-password", () => {
    it("should response 200", async () => {
      const { body } = await request(app)
        .post("/auth/reset-password")
        .send({
          passwordResetToken,
          password: "newPassword",
          confirmPassword: "newPassword",
        })
        .expect(StatusCodes.OK);
      expect(body.message).to.equal("password updated");
    });

    it("should response 404 when the password reset token is invalid", async () => {
      const { body } = await request(app)
        .post("/auth/reset-password")
        .send({
          passwordResetToken: "3",
          password: "newPassword",
          confirmPassword: "newPassword",
        })
        .expect(StatusCodes.NOT_FOUND);
      expect(body.code).to.equal(StatusCodes.NOT_FOUND);
      expect(body.message).to.equal(getReasonPhrase(StatusCodes.NOT_FOUND));
    });

    it("should response 422 when the password reset token is empty", async () => {
      const { body } = await request(app)
        .post("/auth/reset-password")
        .send({
          password: "newPassword",
          confirmPassword: "newPassword",
        })
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal("Validation Error");
      expect(body.errors).to.be.an("array");
      expect(body.errors).to.have.lengthOf(1);
      expect(body.errors[0].field).to.equal("passwordResetToken");
      expect(body.errors[0].message).to.equal(ErrorMessages.PASSWORD_RESET_TOKEN_EMPTY);
    });

    it("should response 422 when the password is too short", async () => {
      const { body } = await request(app)
        .post("/auth/reset-password")
        .send({
          passwordResetToken,
          password: "pass",
          confirmPassword: "pass",
        })
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal("Validation Error");
      expect(body.errors).to.be.an("array");
      expect(body.errors).to.have.lengthOf(1);
      expect(body.errors[0].field).to.equal("password");
      expect(body.errors[0].message).to.equal(ErrorMessages.PASSWORD_TOO_SHORT);
    });

    it("should response 422 when the password is too long", async () => {
      const password = randomBytes(128).toString("hex");
      const { body } = await request(app)
        .post("/auth/reset-password")
        .send({
          passwordResetToken,
          password,
          confirmPassword: password,
        })
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal("Validation Error");
      expect(body.errors).to.be.an("array");
      expect(body.errors).to.have.lengthOf(1);
      expect(body.errors[0].field).to.equal("password");
      expect(body.errors[0].message).to.equal(ErrorMessages.PASSWORD_TOO_LONG);
    });

    it("should response 422 when the password do not match", async () => {
      const { body } = await request(app)
        .post("/auth/reset-password")
        .send({
          passwordResetToken,
          password: "newPassword",
          confirmPassword: "pass",
        })
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal("Validation Error");
      expect(body.errors).to.be.an("array");
      expect(body.errors).to.have.lengthOf(1);
      expect(body.errors[0].field).to.equal("confirmPassword");
      expect(body.errors[0].message).to.equal(ErrorMessages.PASSWORD_NOT_MATCH);
    });

    it("should response 422 when the password is the same as before", async () => {
      const { body } = await request(app)
        .post("/auth/reset-password")
        .send({
          passwordResetToken,
          password: "password",
          confirmPassword: "password",
        })
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal(ErrorMessages.PASSWORD_SAME);
    });

    it("should response 422 when the password reset token is expired", async () => {
      const { body } = await request(app)
        .post("/auth/reset-password")
        .send({
          passwordResetToken: expiredPasswordResetToken.value,
          password: "newPassword",
          confirmPassword: "newPassword",
        })
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal(ErrorMessages.PASSWORD_RESET_TOKEN_EXPIRED);
    });
  });
});
