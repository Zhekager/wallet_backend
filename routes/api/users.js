const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  logout,
  currentUser,
  updateUserInfo,
  uploadAvatar,
  //verifyUser,
  //repeatEmailForVerifyUser,
} = require("../../controllers/users");

const {
  validateCreateUser,
  validateLogin,
  validateResendingEmail,
} = require("../../services/usersValidation");

const guard = require("../../helpers/guard");
const loginLimit = require("../../helpers/rate-limit-login");
const upload = require("../../helpers/uploads");
const wrapError = require("../../helpers/errorHandler");

router.post("/signup", validateCreateUser, wrapError(signup));
router.post("/login", validateLogin, loginLimit, wrapError(login));
router.post("/logout", guard, wrapError(logout));
router.get("/current", guard, wrapError(currentUser));

router.patch("/avatars", guard, upload.single("avatar"), uploadAvatar);

//router.get("/verify/:verifyToken", wrapError(verifyUser));
//router.post("/verify", validateResendingEmail, repeatEmailForVerifyUser);

router.put("/update", guard, updateUserInfo);

module.exports = router;
