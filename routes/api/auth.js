const { Router } = require("express");
const wrapError = require("../../helpers/errorHandler");
const {
  googleAuth,
  googleRedirect,
  findGoogleUser,
} = require("../../controllers/auth");

const router = Router();

router.get("/google", googleAuth);
router.get("/google-redirect", googleRedirect);
router.get("/google-user", findGoogleUser);

module.exports = router;
