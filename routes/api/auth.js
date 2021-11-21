const { Router } = require("express");
const wrapError = require("../../helpers/errorHandler");
const {
  googleAuth,
  googleRedirect,
  findGoogleUser,
} = require("../../controllers/auth");

const router = Router();

router.get("/google", wrapError(googleAuth));
router.get("/google-redirect", wrapError(googleRedirect));
// router.get("/google-user", wrapError(findGoogleUser));

module.exports = router;
