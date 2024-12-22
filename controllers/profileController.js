const User = require("../models/userModel");

const getProfile = (req, res) => {
  try {
    const foundUser = req.user;
    const { _id, email, birthday, username, phone, ...otherInfo } = foundUser;
    const user = { _id, email, birthday, username, phone };

    return res.send({ data: user, message: null });
  } catch (error) {
    res.status(500).send({ data: null, message: "無法獲取用戶資料" });
  }
};

const updateProfile = async (req, res) => {
  console.log(req.body);
  try {
    const { _id, username, phone } = req.body;
    console.log(_id, username, phone);
    await User.updateOne({ _id }, { username, phone });
    res.status(200).send({ data: null, message: "用戶資料更新成功" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ data: null, message: "無法更新用戶資料" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
