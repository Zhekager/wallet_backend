const HttpCode = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

const LimitFieldSize = {
  FIELD_SIZE: 2000000,
};

const LimiterParameters = {
  TIME: 15 * 60 * 1000,
  MAX_ATTEMPT_NUMBER: 10,
};

const ClientMaxBodySize = 10000;
const AvatarSize = "250";

const Transformation = {
  WIDTH: 250,
  HEIGHT: 250,
};

const Category = {
  spend: [
    'Main costs',
    'Products',
    'Car',
    'Taking Care of Yourself',
    'Taking care of children',
    'Home Goods',
    'Education',
    'Leisure',
    'Other expenses',
  ],
  income: [
    'Regular income',
    'Irregular income'
  ]
}

module.exports = {
  HttpCode,
  LimiterParameters,
  ClientMaxBodySize,
  AvatarSize,
  LimitFieldSize,
  Transformation,
  Category,
};
