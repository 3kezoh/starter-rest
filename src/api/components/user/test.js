/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */

/**
 * Module dependencies
 */

const { expect } = require("chai");
const bcrypt = require("bcryptjs");
const { randomBytes } = require("crypto");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const request = require("supertest");
const app = require("../../../config/express");
const mongoose = require("../../../config/mongoose");
const User = require("./User");
const ErrorMessages = require("../../utils/ErrorMessages");

describe("User API", () => {
  let admin;
  let user;
  let yami;
  let adminToken;
  let userToken;
  let adminDocument;
  let userDocument;
  let password;
  let hashedPassword;

  before(() => {
    mongoose.connect();
  });

  beforeEach(async () => {
    password = "password";
    hashedPassword = await bcrypt.hash(password, 1);
    admin = {
      email: "admin@admin.com",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    };
    user = {
      email: "user@user.com",
      password: hashedPassword,
      name: "User",
      role: "user",
    };
    yami = {
      email: "Yami@yugi.com",
      password: "password",
      confirmPassword: "password",
      name: "Yami",
      role: "user",
    };
    await User.deleteMany({});
    await User.insertMany([admin, user]);
    adminDocument = await User.findOne({
      email: admin.email,
    });
    userDocument = await User.findOne({
      email: user.email,
    });
    adminToken = adminDocument.token();
    userToken = userDocument.token();
  });

  /**
   * @route GET /user
   */

  describe("GET /user", () => {
    it("should response 200 with a list of all users", async () => {
      const { body } = await request(app)
        .get("/user")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(StatusCodes.OK);
      expect(body).to.be.an("array");
      expect(body).to.have.lengthOf(2);
    });

    it("should response 401 when the user is not logged in", async () => {
      const { body } = await request(app)
        .get("/user")
        .expect(StatusCodes.UNAUTHORIZED);
      expect(body.code).to.equal(StatusCodes.UNAUTHORIZED);
      expect(body.message).to.equal(getReasonPhrase(StatusCodes.UNAUTHORIZED));
    });

    it("should response 403 when the logged in user is not an admin", async () => {
      const { body } = await request(app)
        .get("/user")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(StatusCodes.FORBIDDEN);
      expect(body.code).to.equal(StatusCodes.FORBIDDEN);
      expect(body.message).to.equal("Access denied");
    });
  });

  /**
   * @route POST /user
   */

  describe("POST /user", () => {
    it("should response 201 with created user", async () => {
      const { body } = await request(app)
        .post("/user")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(yami)
        .expect(StatusCodes.CREATED);
      expect(body).to.not.have.property("errors");
    });

    it("should response 401 when the user is not logged in", async () => {
      const { body } = await request(app)
        .post("/user")
        .send(yami)
        .expect(StatusCodes.UNAUTHORIZED);
      expect(body.code).to.equal(StatusCodes.UNAUTHORIZED);
      expect(body.message).to.equal(getReasonPhrase(StatusCodes.UNAUTHORIZED));
    });

    it("should response 403 when the logged in user is not an admin", async () => {
      const { body } = await request(app)
        .post("/user")
        .set("Authorization", `Bearer ${userToken}`)
        .send(yami)
        .expect(StatusCodes.FORBIDDEN);
      expect(body.code).to.equal(StatusCodes.FORBIDDEN);
      expect(body.message).to.equal("Access denied");
    });

    it("should response 422 when email already exists", async () => {
      yami.email = user.email;
      const { body } = await request(app)
        .post("/user")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(yami)
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal("Email already in use.");
    });

    it("should response 422 when email is invalid", async () => {
      yami.email = "Yami";
      const { body } = await request(app)
        .post("/user")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(yami)
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal("Validation Error");
      expect(body.errors).to.be.an("array");
      expect(body.errors).to.have.lengthOf(1);
      expect(body.errors[0].field).to.equal("email");
      expect(body.errors[0].message).to.equal(ErrorMessages.EMAIL_INVALID);
    });

    it("should response 422 when password is too short", async () => {
      yami.password = "exodia";
      yami.confirmPassword = yami.password;
      const { body } = await request(app)
        .post("/user")
        .set("Authorization", `Bearer ${adminToken}`)
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
        .post("/user")
        .set("Authorization", `Bearer ${adminToken}`)
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
      yami.confirmPassword = "Exodia";
      const { body } = await request(app)
        .post("/user")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(yami)
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal("Validation Error");
      expect(body.errors).to.be.an("array");
      expect(body.errors).to.have.lengthOf(1);
      expect(body.errors[0].field).to.equal("confirmPassword");
      expect(body.errors[0].message).to.equal(ErrorMessages.PASSWORD_NOT_MATCH);
    });

    it("should response 422 when role is empty", async () => {
      delete yami.role;
      const { body } = await request(app)
        .post("/user")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(yami)
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal("Validation Error");
      expect(body.errors).to.be.an("array");
      expect(body.errors).to.have.lengthOf(1);
      expect(body.errors[0].field).to.equal("role");
      expect(body.errors[0].message).to.equal(ErrorMessages.ROLE_EMPTY);
    });

    it("should response 422 when role is different from admin or user", async () => {
      yami.role = "duelist";
      const { body } = await request(app)
        .post("/user")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(yami)
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal("Validation Error");
      expect(body.errors).to.be.an("array");
      expect(body.errors).to.have.lengthOf(1);
      expect(body.errors[0].field).to.equal("role");
      expect(body.errors[0].message).to.equal(ErrorMessages.ROLE_VALUE);
    });
  });

  /**
   * @route GET /user/profile
   */

  describe("GET /user/profile", () => {
    it("should response 200 with the information of the logged in user", async () => {
      const { body } = await request(app)
        .get("/user/profile")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(StatusCodes.OK);
      expect(body).to.be.an("object");
      expect(body).to.not.have.property("password");
    });

    it("should response 401 when the user is not logged in", async () => {
      const { body } = await request(app)
        .get("/user/profile")
        .expect(StatusCodes.UNAUTHORIZED);
      expect(body.code).to.equal(StatusCodes.UNAUTHORIZED);
      expect(body.message).to.equal(getReasonPhrase(StatusCodes.UNAUTHORIZED));
    });
  });

  /**
   * @route PUT /user/:_id
   */

  describe("PUT /user/:_id", () => {
    it("should response 200 as user with the outdated user information", async () => {
      const { body } = await request(app)
        .put(`/user/${userDocument._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ name: "name" })
        .expect(StatusCodes.OK);
      expect(body.message).to.equal("User updated");
      expect(body.outdatedUser).to.be.an("object");
      expect(body.outdatedUser.name).to.equal("User");
      expect(body.outdatedUser).to.not.have.property("password");
    });

    it("should response 200 as admin with the outdated user information when ", async () => {
      const { body } = await request(app)
        .put(`/user/${userDocument._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "name" })
        .expect(StatusCodes.OK);
      expect(body.message).to.equal("User updated");
      expect(body.outdatedUser).to.be.an("object");
      expect(body.outdatedUser.name).to.equal("User");
      expect(body.outdatedUser).to.not.have.property("password");
    });

    it("should response 401 when the user is not logged in", async () => {
      const { body } = await request(app)
        .put(`/user/${userDocument._id}`)
        .send({ name: "name" })
        .expect(StatusCodes.UNAUTHORIZED);
      expect(body.code).to.equal(StatusCodes.UNAUTHORIZED);
      expect(body.message).to.equal(getReasonPhrase(StatusCodes.UNAUTHORIZED));
    });

    it("should response 403 when the logged in user try to mutate other user data", async () => {
      const { body } = await request(app)
        .put(`/user/${adminDocument._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ name: "name" })
        .expect(StatusCodes.FORBIDDEN);
      expect(body.code).to.equal(StatusCodes.FORBIDDEN);
      expect(body.message).to.equal("Access denied");
    });

    it("should response 404 when the _id don't correspond to anybody", async () => {
      const { body } = await request(app)
        .put(`/user/${randomBytes(12).toString("hex")}`)
        .send({ name: "name" })
        .expect(StatusCodes.NOT_FOUND);
      expect(body.code).to.equal(StatusCodes.NOT_FOUND);
      expect(body.message).to.equal("User does not exist");
    });

    it("should response 422 when the _id is invalid", async () => {
      const { body } = await request(app)
        .put("/user/3")
        .send({ name: "name" })
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal("user _id is invalid");
    });

    it("should response 422 when the name is too short", async () => {
      const { body } = await request(app)
        .put(`/user/${userDocument._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ name: "n" })
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal("Validation Error");
      expect(body.errors).to.be.an("array");
      expect(body.errors).to.have.lengthOf(1);
      expect(body.errors[0].field).to.equal("name");
      expect(body.errors[0].message).to.equal(
        "name should be at least 3 characters long"
      );
    });
  });

  /**
   * @route DELETE /user/:_id
   */

  describe("DELETE /user/:_id", () => {
    it("should response 200 as user with the user information deleted", async () => {
      const { body } = await request(app)
        .delete(`/user/${userDocument._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(StatusCodes.OK);
      expect(body).to.be.an("object");
      expect(body.message).to.equal("User deleted");
      expect(body.deletedUser).to.be.an("object");
      expect(body.deletedUser).to.not.have.property("password");
    });

    it("should response 200 as admin with the user information deleted", async () => {
      const { body } = await request(app)
        .delete(`/user/${userDocument._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(StatusCodes.OK);
      expect(body).to.be.an("object");
      expect(body.message).to.equal("User deleted");
      expect(body.deletedUser).to.be.an("object");
      expect(body.deletedUser).to.not.have.property("password");
    });

    it("should response 401 when the user is not logged in", async () => {
      const { body } = await request(app)
        .delete(`/user/${userDocument._id}`)
        .expect(StatusCodes.UNAUTHORIZED);
      expect(body.code).to.equal(StatusCodes.UNAUTHORIZED);
      expect(body.message).to.equal(getReasonPhrase(StatusCodes.UNAUTHORIZED));
    });

    it("should response 403 when the logged in user try to delete other user data", async () => {
      const { body } = await request(app)
        .delete(`/user/${adminDocument._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(StatusCodes.FORBIDDEN);
      expect(body.code).to.equal(StatusCodes.FORBIDDEN);
      expect(body.message).to.equal("Access denied");
    });

    it("should response 404 when the _id don't correspond to anybody", async () => {
      const { body } = await request(app)
        .delete(`/user/${randomBytes(12).toString("hex")}`)
        .expect(StatusCodes.NOT_FOUND);
      expect(body.code).to.equal(StatusCodes.NOT_FOUND);
      expect(body.message).to.equal("User does not exist");
    });

    it("should response 422 when the _id is invalid", async () => {
      const { body } = await request(app)
        .delete("/user/3")
        .expect(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.code).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body.message).to.equal("user _id is invalid");
    });
  });
});
