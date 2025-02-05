import { ROLES } from "../common/constants.mjs";

const userCreateValidationSchema = {
  username: {
    notEmpty: {
      errorMessage: "Username is required",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
    isLength: {
      options: { min: 3, max: 20 },
      errorMessage: "Username must be between 3 and 20 characters long",
    },
    custom: {
      options: (value) => !value.includes(" "),
      errorMessage: "Username cannot contain spaces",
    },
    trim: true,
  },
  displayName: {
    notEmpty: {
      errorMessage: "Display name is required",
    },
    isString: {
      errorMessage: "Display name must be a string",
    },
    isLength: {
      options: { min: 3, max: 20 },
      errorMessage: "Display name must be between 3 and 20 characters long",
    },
    trim: true,
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required",
    },
    isString: {
      errorMessage: "Password must be a string",
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
  },
  role: {
    notEmpty: {
      errorMessage: "Role is required",
    },
    isString: {
      errorMessage: "Role must be a string",
    },
    isIn: {
      options: [[ROLES.VENDOR, ROLES.USER]],
      errorMessage: "Invalid role",
    },
  },
};

export { userCreateValidationSchema };
