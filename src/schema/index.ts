import { checkSchema } from 'express-validator';

export const ALPHABETS_REGEX = /^[A-Za-z ]*$/
//messages
export const PASSWORD_VALIDATION_MESSAGE = "Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character";
export const ValidMessage = (fieldName: string) => `Please enter valid ${fieldName}`;
export const RequiredMessage = (fieldName: string) => `${fieldName} is required`;

export const registrationSchema = checkSchema({
  firstName: {
    in: ['body'],
    matches: {
      options: ALPHABETS_REGEX,
      errorMessage: ValidMessage("FirstName"),
    },

    errorMessage: RequiredMessage("FirstName"),
  },

  lastName: {
    in: ['body'],
    matches: {
      options: ALPHABETS_REGEX,
      errorMessage: ValidMessage("Last Name"),
    },

    errorMessage: RequiredMessage("Last Name"),
  },

  password: {
    in: ['body'],

    errorMessage: RequiredMessage("Password"),
  },

  email: {
    in: ['body'],
    normalizeEmail: true,
    isEmail: {
      bail: true,
    },

    errorMessage: RequiredMessage("Email"),
  },

  dateOfBirth: {
    in: ['body'],
    errorMessage: RequiredMessage("Date Of Birth"),
  }
})

export const loginSchema = checkSchema({
  password: {
    in: ['body'],
    errorMessage: RequiredMessage("Password"),
  },

  email: {
    in: ['body'],
    normalizeEmail: true,
    isEmail: {
      bail: true,
    },

    errorMessage: RequiredMessage("Email"),
  },
});

export const updateUserProfileSchema = checkSchema({
  userId: {
    in: ['params'],
    optional: true,
    errorMessage: RequiredMessage("User Id"),
  },

  firstName: {
    in: ['body'],
    matches: {
      options: ALPHABETS_REGEX,
      errorMessage: ValidMessage("FirstName"),
    },
    optional: true,
  },

  lastName: {
    in: ['body'],
    matches: {
      options: ALPHABETS_REGEX,
      errorMessage: ValidMessage("Last Name"),
    },

    optional: true,
  },

  dateOfBirth: {
    in: ['body'],
    isDate: true,
    optional: true,
  }
});

export const createPostSchema = checkSchema({
  description: {
    in: ['body'],

    errorMessage: RequiredMessage("Description"),
  },
});

export const updatePostSchema = checkSchema({
  id: {
    in: ['params'],
    errorMessage: RequiredMessage("Post Id"),
  },

  description: {
    in: ['body'],
    optional: true,
  },
});

export const addCommentToPostSchema = checkSchema({
  id: {
    in: ["params"],
    errorMessage: RequiredMessage("Post Id"),
  },

  comment: {
    in: ['body'],
    errorMessage: RequiredMessage("Comment"),
  },
});