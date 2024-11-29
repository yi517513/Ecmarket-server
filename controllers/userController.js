const User = require("../models/userModel");

const getProfile = (req, res) => {
  console.log(`in getProfile route`);
  return res.send({ data: req.user });
};

const updateProfile = async (req, res) => {
  console.log("in updateUserProfile route");
  try {
    const userId = req.user.id;
    const { username, birthday, gender, phone, address } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        username,
        birthday,
        gender,
        phone,
        address,
      },
      { new: true }
    );
    res.status(200).send({ message: "用戶資料更新成功" });
  } catch (error) {
    res.status(500).send({ message: "無法更新用戶資料" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
