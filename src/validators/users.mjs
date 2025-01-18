import { body } from "express-validator";
const usernameValidator = () =>
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .custom((value) => !value.includes(" "))
    .withMessage("Username cannot contain spaces")
    .isString()
    .withMessage("Username must be a string")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters long")
    .trim();

const displayNameValidator = () =>
  body("displayName")
    .notEmpty()
    .withMessage("Display name is required")
    .isString()
    .withMessage("Display name must be a string")
    .isLength({ min: 3, max: 20 })
    .withMessage("Display name must be between 3 and 20 characters long")
    .trim();
export { usernameValidator, displayNameValidator };