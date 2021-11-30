const User = require("../model/user");

const create = async (options) => {
  const user = new User(options);
  return await user.save();
};

const findById = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

// const findUserByVerifyToken = async (verifyToken) => {
//   return await User.findOne({ verifyToken });
// };

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

// const updateTokenVerify = async (id, verify, verifyToken) => {
//   return await User.updateOne({ _id: id }, { verify, verifyToken });
// };

const updateAvatar = async (id, avatar, idUserCloud = null) => {
  return await User.updateOne({ _id: id }, { avatar, idUserCloud });
};

const updateUser = async (id, body) => {
  return await User.findOneAndUpdate({ _id: id }, { ...body }, { new: true });
};

const updateUserBalance = async (userId, body) => {
  const result = await User.findByIdAndUpdate(userId, body, { new: true });
  return result;
};

module.exports = {
  findByEmail,
  findById,
  create,
  updateToken,
  updateAvatar,
  //findUserByVerifyToken,
  //updateTokenVerify,
  updateUser,
  updateUserBalance,
};
