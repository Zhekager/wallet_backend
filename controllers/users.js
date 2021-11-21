const jwt = require("jsonwebtoken");
const Users = require("../repository/users");
const fs = require("fs").promises;

const UploadService = require("../services/cloud-upload");
const { HttpCode } = require("../helpers/constants");

const SECRET_KEY = process.env.JWT_SECRET_KEY;

//const EmailService = require("../services/email/service");
//const { CreateSenderSendGrid } = require("../services/email/sender");
require("dotenv").config();

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await Users.findByEmail(email);
  if (user) {
    return res.status(HttpCode.CONFLICT).json({
      status: "error",
      code: HttpCode.CONFLICT,
      message: "Email is already in use",
    });
  }
  try {
    const newUser = await Users.create({
      name,
      email,
      password,
    });
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
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findByEmail(email);
  // const isValidPassword = await user?.isValidPassword(password);
  const isValidPassword =
    (await user) === null || (await user) === undefined
      ? undefined
      : await user.isValidPassword(password);

  // if (!user || !isValidPassword || !user?.verify) {
  // if (!user || !isValidPassword || (!user === true && user.verify)) {
  //   return res.status(HttpCode.UNAUTHORIZED).json({
  //     status: "error",
  //     code: HttpCode.UNAUTHORIZED,
  //     message: "Email or password is wrong",
  //   });
  // }

  //new
  // const id = user && user.id;
  // const newSession = await Session.create({
  //   id,
  // });

  // const accessToken = jwt.sign({ id, newSession }, SECRET_KEY, {
  //   expiresIn: "1h",
  // });
  // const refreshToken = jwt.sign({ id, newSession }, SECRET_KEY, {
  //   expiresIn: "24h",
  // });

  //old
  // const id = user?._id;
  const id = user && user.id;
  const payload = { id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

  await Users.updateToken(id, token);
  return res.status(HttpCode.OK).json({
    status: "success",
    code: HttpCode.OK,
    message: "You have logged in",
    data: {
      token,
    },
  });
};

//new
//   await User.updateToken(id, token);
//   return res.json({
//     status: "success",
//     code: HttpCode.OK,
//     accessToken,
//     refreshToken,
//     newSession,
//     data: {
//       email,
//       username,
//       id,
//     },
//   });
// };

const currentUser = async (req, res, next) => {
  try {
    const id = req.user._id;
    const { name, email } = req.user;
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      user: {
        id,
        name,
        email,
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

const verifyUser = async (req, res, _next) => {
  const user = await Users.findUserByVerifyToken(req.params.verifyToken);

  if (user) {
    await Users.updateTokenVerify(user._id, true, null);
    return res.json({
      status: "success",
      code: HttpCode.OK,
      message: "Verification successful",
    });
  }
  return res.status(HttpCode.NOT_FOUND).json({
    status: "error",
    code: HttpCode.NOT_FOUND,
    message: "User not Found",
  });
};

const repeatEmailForVerifyUser = async (req, res, next) => {
  const { email } = req.body;
  const user = await Users.findByEmail(email);

  if (user && user.verify) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      message: "Verification has already been passed",
    });
  }

  if (user) {
    const { email, name, verifyToken } = user;
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new CreateSenderSendGrid()
    );
    await emailService.sendVerifyEmail(email, name, verifyToken);
  }
  return res.status(HttpCode.OK).json({
    status: "success",
    code: HttpCode.OK,
    data: {
      message: "Verification email sent",
    },
  });
};

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
  verifyUser,
  //repeatEmailForVerifyUser,
};
