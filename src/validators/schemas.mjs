const userCreateValidationSchema = {
  username: {
    notEmpty: {
      errorMessage: "Username is required"
    },
    isString: {
      errorMessage: "Username must be a string"
    },
    isLength: {
      options: { min: 3, max: 20 },
      errorMessage: "Username must be between 3 and 20 characters long"
    },
    custom: {
      options: (value) => !value.includes(" "),
      errorMessage: "Username cannot contain spaces"
    },
    trim: true
  },
  displayName: {
    notEmpty: {
      errorMessage: "Display name is required"
    },
    isString: {
      errorMessage: "Display name must be a string"
    },
    isLength: {
      options: { min: 3, max: 20 },
      errorMessage: "Display name must be between 3 and 20 characters long"
    },
    trim: true
  }
};

export { userCreateValidationSchema };
