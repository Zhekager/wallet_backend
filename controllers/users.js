const queryString = require("query-string");
const axios = require("axios");
// const URL = require("url");

const jwt = require("jsonwebtoken");
const fs = require("fs").promises;

const UploadService = require("../services/cloud-upload");
const { HttpCode } = require("../helpers/constants");
const { CustomError } = require("../helpers/customError");
const Transaction = require("../model/transaction");
const Users = require("../repository/users");

require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const BASE_URL = process.env.BASE_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

//const EmailService = require("../services/email/service");
//const { CreateSenderSendGrid } = require("../services/email/sender");
require("dotenv").config();

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await Users.findByEmail(email);
  if (user) {
    throw new CustomError(HttpCode.CONFLICT, "Email is already in use");
  }
  const newUser = await Users.create({ name, email, password });
  // const emailService = new EmailService(
  //   process.env.NODE_ENV,
  //   new CreateSenderSendGrid()
  // );
  // const statusEmail = await emailService.sendVerifyEmail(
  //   newUser.email,
  //   newUser.name,
  //   newUser.verifyToken
  // );

  return res.status(HttpCode.CREATED).json({
    status: "success",
    code: HttpCode.CREATED,
    message: "User created",
    data: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatarURL,

      //successEmail: statusEmail,
    },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findByEmail(email);
  const isValidPassword = await user?.isValidPassword(password);

  // const isValidPassword =
  //   (await user) === null || (await user) === undefined
  //     ? undefined
  //     : await user.isValidPassword(password);

  // if (!user || !isValidPassword || !user?.verify) {
  // if (!user || !isValidPassword || (!user && user.verify)) {
  //   throw new CustomError(HttpCode.UNAUTHORIZED, "Email or password is wrong");
  //}

  const id = user?._id;
  //const id = user && user._id;
  const payload = { id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  await Users.updateToken(id, token);

  const { name, avatar, balance, _id } = user;
  const transactions = await Transaction.find({
    owner: _id,
  }).populate({ path: "category", select: "name" });

  return res.status(HttpCode.OK).json({
    status: "success",
    code: HttpCode.OK,
    message: "You have logged in",
    data: {
      name,
      email,
      token,
      avatar,
      balance,
      transactions: transactions,
    },
  });
};

const googleAuth = async (req, res, next) => {
  try {
    const stringifiedParams = queryString.stringify({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: `${BASE_URL}/api/users/google-redirect`,
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ].join(" "),
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
    });
    return res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
    );
  } catch (error) {
    next(error);
  }
};

let existingUser = "";

const googleRedirect = async (req, res, next) => {
  try {
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    const urlObj = new URL(fullUrl);
    const urlParams = queryString.parse(urlObj.search);

    const code = urlParams.code;
    const tokenData = await axios({
      url: `https://oauth2.googleapis.com/token`,
      method: "post",
      data: {
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${BASE_URL}/api/users/google-redirect`,
        grant_type: "authorization_code",
        code: code,
      },
    });

    const userData = await axios({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
      method: "get",
      headers: {
        Authorization: `Bearer ${tokenData.data.access_token}`,
      },
    });

    const userEmail = userData.data.email;
    console.log(userEmail);
    existingUser = await Users.findByEmail(userEmail);
    if (!existingUser) {
      existingUser = await Users.create({ email: userEmail });
    }

    const token = jwt.sign({ _id: existingUser.id }, SECRET_KEY);
    await Users.updateToken(existingUser.id, token);
    return res.redirect(`${FRONTEND_URL}/google-user`);
  } catch (error) {
    next(error);
  }
};

const findGoogleUser = async (_req, res, _next) => {
  const user = await Users.findByEmail(existingUser.email);

  const { _id: id, email, token } = user;
  res.status(HttpCode.OK).json({
    status: "success",
    code: HttpCode.OK,
    data: {
      token,
      user: {
        id,
        email,
      },
    },
  });
};

const findUserByEmail = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    const { _id: id, name, email } = user;
    if (user) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: {
          user: {
            id,
            name,
            email,
          },
        },
      });
    }
    return res.status(HttpCode.CONFLICT).json({
      status: "error",
      code: HttpCode.CONFLICT,
      message: "Email is not found",
    });
  } catch (error) {
    next(error);
  }
};

const currentUser = async (req, res, next) => {
  try {
    const id = req.user._id;
    const { name, email, avatar, token, balance, _id } = req.user;
    const transactions = await Transaction.find({
      owner: _id,
    }).populate({ path: "category", select: "name" });
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      user: {
        id,
        name,
        email,
        avatar,
        token,
        balance,
        transactions: transactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateUserInfo = async (req, res, next) => {
  try {
    const id = req.user._id;
    const result = await Users.updateUser(id, req.body);
    console.log(result);
    if (result) {
      return res.json({
        status: "success",
        code: HttpCode.OK,
        data: { result },
      });
    }
    return res.json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "User not found",
    });
  } catch (e) {
    next(e);
  }
};

const uploadAvatar = async (req, res, _next) => {
  const { id, idUserCloud } = req.user;
  const file = req.file;

  const destination = "Avatars";
  const uploadService = new UploadService(destination);
  const { avatarUrl, returnIdUserCloud } = await uploadService.save(
    file.path,
    idUserCloud
  );

  await Users.updateAvatar(id, avatarUrl, returnIdUserCloud);
  try {
    await fs.unlink(file.path);
  } catch (error) {
    console.log(error.message);
  }
  return res.status(HttpCode.OK).json({
    status: "success",
    code: HttpCode.OK,
    data: {
      avatar: avatarUrl,
    },
  });
};

// const verifyUser = async (req, res, _next) => {
//   const user = await Users.findUserByVerifyToken(req.params.verifyToken);

//   if (user) {
//     await Users.updateTokenVerify(user._id, true, null);
//     return res.json({
//       status: "success",
//       code: HttpCode.OK,
//       message: "Verification successful",
//     });
//   }
//   return res.status(HttpCode.NOT_FOUND).json({
//     status: "error",
//     code: HttpCode.NOT_FOUND,
//     message: "User not Found",
//   });
// };

// const repeatEmailForVerifyUser = async (req, res, next) => {
//   const { email } = req.body;
//   const user = await Users.findByEmail(email);

//   if (user && user.verify) {
//     return res.status(HttpCode.BAD_REQUEST).json({
//       status: "error",
//       code: HttpCode.BAD_REQUEST,
//       message: "Verification has already been passed",
//     });
//   }

//   if (user) {
//     const { email, name, verifyToken } = user;
//     const emailService = new EmailService(
//       process.env.NODE_ENV,
//       new CreateSenderSendGrid()
//     );
//     await emailService.sendVerifyEmail(email, name, verifyToken);
//   }
//   return res.status(HttpCode.OK).json({
//     status: "success",
//     code: HttpCode.OK,
//     data: {
//       message: "Verification email sent",
//     },
//   });
// };

const logout = async (req, res) => {
  const id = req.user._id;
  await Users.updateToken(id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};

module.exports = {
  signup,
  login,
  logout,
  currentUser,
  updateUserInfo,
  uploadAvatar,
  //verifyUser,
  //repeatEmailForVerifyUser,
  googleAuth,
  googleRedirect,
  findUserByEmail,
  findGoogleUser,
};
