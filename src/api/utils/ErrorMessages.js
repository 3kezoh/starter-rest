/**
 * Author
 */

const AUTHOR_EMPTY = "Author cannot be blank.";

/**
 * User
 */

const USER_NOT_FOUND = "Could not find user.";

/**
 * Email
 */

const EMAIL_INVALID = "Please enter a valid email.";
const EMAIL_USED = "Email already in use.";
const EMAIL_NOT_FOUND = (email) => `Email ${email} not found.`;

/**
 * Password
 */

const PASSWORD_INVALID = "Password invalid.";
const PASSWORD_EMPTY = "Password cannot be blank.";
const PASSWORD_TOO_SHORT = "Password must be at least 8 characters long.";
const PASSWORD_TOO_LONG = "Password cannot exceed 128 characters long.";
const PASSWORD_NOT_MATCH = "Password do not match.";
const PASSWORD_SAME = "Password is the same.";

/**
 * Name
 */

const NAME_TOO_SHORT = "Name must be at least 3 characters long.";
const NAME_TOO_LONG = "Name cannot exceed 32 characters long.";

/**
 * Role
 */

const ROLE_EMPTY = "Role cannot be blank.";
const ROLE_VALUE = "Role can only be admin or user.";

/**
 * Refresh token
 */

const REFRESH_TOKEN_EMPTY = "refreshToken cannot be blank.";
const REFRESH_TOKEN_EXPIRED = "refresh token expired.";

/**
 * Password reset token
 */

const PASSWORD_RESET_TOKEN_EMPTY = "passwordResetToken cannot be blank.";
const PASSWORD_RESET_TOKEN_EXPIRED = "Password reset token expired.";

const ErrorMessages = {
  /**
   * Author exports
   */

  AUTHOR_EMPTY,

  /**
   * Post exports
   */

  USER_NOT_FOUND,

  /**
   * Email exports
   */

  EMAIL_INVALID,
  EMAIL_USED,
  EMAIL_NOT_FOUND,

  /**
   * Password exports
   */

  PASSWORD_INVALID,
  PASSWORD_EMPTY,
  PASSWORD_TOO_SHORT,
  PASSWORD_TOO_LONG,
  PASSWORD_NOT_MATCH,
  PASSWORD_SAME,

  /**
   * Name exports
   */

  NAME_TOO_SHORT,
  NAME_TOO_LONG,

  /**
   * Role exports
   */

  ROLE_EMPTY,
  ROLE_VALUE,

  /**
   * Refresh token exports
   */

  REFRESH_TOKEN_EMPTY,
  REFRESH_TOKEN_EXPIRED,

  /**
   * Password reset token exports
   */

  PASSWORD_RESET_TOKEN_EMPTY,
  PASSWORD_RESET_TOKEN_EXPIRED,
};

module.exports = ErrorMessages;
