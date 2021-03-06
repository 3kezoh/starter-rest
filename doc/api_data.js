define({ "api": [
  {
    "type": "post",
    "url": "/auth/login",
    "title": "",
    "description": "<p>Sign in user</p>",
    "version": "1.0.0",
    "name": "Login",
    "group": "Auth",
    "permission": [
      {
        "name": "public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 Ok": [
          {
            "group": "200 Ok",
            "optional": false,
            "field": "token",
            "description": "<p>Authorization token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404 Not Found": [
          {
            "group": "404 Not Found",
            "optional": false,
            "field": "NotFound",
            "description": "<p>User does not exist</p>"
          }
        ],
        "422 Unprocessable Entity": [
          {
            "group": "422 Unprocessable Entity",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ]
      }
    },
    "filename": "src/api/components/auth/router.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/refresh-token",
    "title": "",
    "description": "<p>Refresh expired accessToken</p>",
    "version": "1.0.0",
    "name": "RefreshToken",
    "group": "Auth",
    "permission": [
      {
        "name": "public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>Refresh token acquired when user logged in</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 Ok": [
          {
            "group": "200 Ok",
            "optional": false,
            "field": "token",
            "description": "<p>Authorization token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404 Not Found": [
          {
            "group": "404 Not Found",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Invalid refresh token</p>"
          }
        ],
        "422 Unprocessable Entity": [
          {
            "group": "422 Unprocessable Entity",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ]
      }
    },
    "filename": "src/api/components/auth/router.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/reset-password",
    "title": "",
    "description": "<p>Update a user password</p>",
    "version": "1.0.0",
    "name": "ResetPassword",
    "group": "Auth",
    "permission": [
      {
        "name": "public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "PasswordResetToken",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 Ok": [
          {
            "group": "200 Ok",
            "optional": false,
            "field": "Message",
            "description": ""
          }
        ]
      }
    },
    "error": {
      "fields": {
        "404 Not Found": [
          {
            "group": "404 Not Found",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The password reset token is invalid</p>"
          }
        ],
        "422 Unprocessable Entity": [
          {
            "group": "422 Unprocessable Entity",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ]
      }
    },
    "filename": "src/api/components/auth/router.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/signup",
    "title": "",
    "description": "<p>Create a new user account</p>",
    "version": "1.0.0",
    "name": "Signup",
    "group": "Auth",
    "permission": [
      {
        "name": "public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "confirmPassword",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200 Ok": [
          {
            "group": "200 Ok",
            "optional": false,
            "field": "token",
            "description": "<p>Authorization token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "422 Unprocessable Entity": [
          {
            "group": "422 Unprocessable Entity",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ]
      }
    },
    "filename": "src/api/components/auth/router.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/user",
    "title": "",
    "description": "<p>Create a new user.</p>",
    "version": "1.0.0",
    "name": "Create",
    "group": "User",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "confirmPassword",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": ""
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401 Unauthorized": [
          {
            "group": "401 Unauthorized",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated users can access the data</p>"
          }
        ],
        "403 Forbidden": [
          {
            "group": "403 Forbidden",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can access the data</p>"
          }
        ],
        "422 Unprocessable Entity": [
          {
            "group": "422 Unprocessable Entity",
            "optional": false,
            "field": "ValidationError",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ]
      }
    },
    "filename": "src/api/components/user/router.js",
    "groupTitle": "User"
  },
  {
    "type": "delete",
    "url": "/user/:_id",
    "title": "",
    "description": "<p>Delete logged in user</p>",
    "version": "1.0.0",
    "name": "Delete",
    "group": "User",
    "permission": [
      {
        "name": "user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Deleted user's _id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Deleted user's email</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Deleted user's name</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401 Unauthorized": [
          {
            "group": "401 Unauthorized",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated users can access the data</p>"
          }
        ],
        "403 Forbidden": [
          {
            "group": "403 Forbidden",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only user with same id or admins can delete the data</p>"
          }
        ],
        "404 Not Found": [
          {
            "group": "404 Not Found",
            "optional": false,
            "field": "NotFound",
            "description": "<p>User does not exist</p>"
          }
        ],
        "422 Unprocessable Entity": [
          {
            "group": "422 Unprocessable Entity",
            "optional": false,
            "field": "UnprocessableEntity",
            "description": "<p>_id is invalid</p>"
          }
        ]
      }
    },
    "filename": "src/api/components/user/router.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user",
    "title": "",
    "description": "<p>Get all users</p>",
    "version": "1.0.0",
    "name": "List",
    "group": "User",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "users",
            "description": "<p>List of users</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401 Unauthorized": [
          {
            "group": "401 Unauthorized",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated users can access the data</p>"
          }
        ],
        "403 Forbidden": [
          {
            "group": "403 Forbidden",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only admins can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/components/user/router.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/user/:_id",
    "title": "",
    "description": "<p>Update user information</p>",
    "version": "1.0.0",
    "name": "Update",
    "group": "User",
    "permission": [
      {
        "name": "user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Access token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Outdated user's name</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401 Unauthorized": [
          {
            "group": "401 Unauthorized",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Only authenticated users can update the data</p>"
          }
        ],
        "403 Forbidden": [
          {
            "group": "403 Forbidden",
            "optional": false,
            "field": "Forbidden",
            "description": "<p>Only user with same id or admins can update the data</p>"
          }
        ],
        "404 Not Found": [
          {
            "group": "404 Not Found",
            "optional": false,
            "field": "NotFound",
            "description": "<p>User does not exist</p>"
          }
        ],
        "422 Unprocessable Entity": [
          {
            "group": "422 Unprocessable Entity",
            "optional": false,
            "field": "UnprocessableEntity",
            "description": "<p>_id is invalid</p>"
          },
          {
            "group": "422 Unprocessable Entity",
            "optional": false,
            "field": "ValidationErrors",
            "description": "<p>Some parameters may contain invalid values</p>"
          }
        ]
      }
    },
    "filename": "src/api/components/user/router.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user/profile",
    "title": "",
    "description": "<p>Get logged in user profile information</p>",
    "version": "1.0.0",
    "name": "UserProfile",
    "group": "User",
    "permission": [
      {
        "name": "user"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Access token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": ""
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401 Unauthorized": [
          {
            "group": "401 Unauthorized",
            "optional": false,
            "field": "Only",
            "description": "<p>authenticated users can access the data</p>"
          }
        ]
      }
    },
    "filename": "src/api/components/user/router.js",
    "groupTitle": "User"
  }
] });
