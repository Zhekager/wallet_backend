const queryString = require("query-string");
const axios = require("axios");
// const URL = require("url");

require("dotenv").config();
const jwt = require("jsonwebtoken");
const Users = require("../repository/users");
// const { HttpCode } = require("../helpers/constants");

// const Session = require("../model/session");

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const BASE_URL = process.env.BASE_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

// const googleAuth = async (req, res, next) => {
//   try {
//     const stringifiedParams = queryString.stringify({
//       client_id: GOOGLE_CLIENT_ID,
//       redirect_uri: `${BASE_URL}/auth/google-redirect`,
//       scope: [
//         "https://www.googleapis.com/auth/userinfo.email",
//         "https://www.googleapis.com/auth/userinfo.profile",
//       ].join(" "),
//       response_type: "code",
//       access_type: "offline",
//       prompt: "consent",
//     });
//     return res.redirect(
//       `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
//     );
//   } catch (error) {
//     next(error);
//   }
// };

// let existingUser = "";

// const googleRedirect = async (req, res, next) => {
//   try {
//     const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
//     const urlObj = new URL(fullUrl);
//     const urlParams = queryString.parse(urlObj.search);

//     const code = urlParams.code;
//     const tokenData = await axios({
//       url: `https://oauth2.googleapis.com/token`,
//       method: "post",
//       data: {
//         client_id: GOOGLE_CLIENT_ID,
//         client_secret: GOOGLE_CLIENT_SECRET,
//         redirect_uri: `${BASE_URL}/auth/google-redirect`,
//         grant_type: "authorization_code",
//         code: code,
//       },
//     });

//     const userData = await axios({
//       url: "https://www.googleapis.com/oauth2/v2/userinfo",
//       method: "get",
//       headers: {
//         Authorization: `Bearer ${tokenData.data.access_token}`,
//       },
//     });

//     const userEmail = userData.data.email;
//     console.log(userEmail);
//     existingUser = await Users.findByEmail(userEmail);
//     if (!existingUser) {
//       existingUser = await Users.create({ email: userEmail });
//     }

//     const token = jwt.sign({ _id: existingUser.id }, SECRET_KEY);
//     await Users.updateToken(existingUser.id, token);
//     return res.redirect(`${FRONTEND_URL}/google-user`);
//   } catch (error) {
//     next(error);
//   }
// };

// const findGoogleUser = async (_req, res, _next) => {
//   const user = await Users.findByEmail(existingUser.email);

//   const { _id: id, email, token} = user;
//   res.status(HttpCode.OK).json({
//     status: "success",
//     code: HttpCode.OK,
//     data: {
//       token,
//       user: {
//         id,
//         email,
//       },
//     },
//   });
// };

// const findUserByEmail = async (req, res, next) => {
//   try {
//     const user = await Users.findByEmail(req.body.email);
//     const { _id: id, name, email } = user;
//     if (user) {
//       return res.status(HttpCode.OK).json({
//         status: "success",
//         code: HttpCode.OK,
//         data: {
//           user: {
//             id,
//             name,
//             email,
//           },
//         },
//       });
//     }
//     return res.status(HttpCode.CONFLICT).json({
//       status: "error",
//       code: HttpCode.CONFLICT,
//       message: "Email is not found",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   googleAuth,
//   googleRedirect,
//   findUserByEmail,
//   findGoogleUser,
// };

const googleAuth = async (req, res) => {
  const stringifiedParams = queryString.stringify({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${BASE_URL}/auth/google-redirect`,
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
};

const googleRedirect = async (req, res) => {
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
      redirect_uri: `${BASE_URL}/auth/google-redirect`,
      grant_type: "authorization_code",
      code,
    },
  });

  const userData = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });

  let existingUser = await Users.updateToken({ email: userData.data.email });
  if (!existingUser || !existingUser.originUrl) {
    return res.status(403).send({
      message: "Register at first",
    });
  }

  const newSession = await Session.create({
    _id: existingUser._id,
  });

  const accessToken = jwt.sign(
    { _id: existingUser._id, _id: newSession._id },
    SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  const refreshToken = jwt.sign(
    { _id: existingUser._id, _id: newSession._id },
    SECRET_KEY,
    {
      expiresIn: "10h",
    }
  );

  return res.redirect(
    `${existingUser.originUrl}?accessToken=${accessToken}&refreshToken=${refreshToken}&_id=${newSession._id}`
  );
};

module.exports = {
  googleAuth,
  googleRedirect,
};
