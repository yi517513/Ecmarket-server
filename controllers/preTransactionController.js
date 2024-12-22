// 買家獲取付款收據，用以決定是否開啟交易
const getPendingPreTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    return res.status(200).send({ message: null, data: null });
  } catch (error) {
    console.log(error);
    return res.status(500).send("發生錯誤");
  }
};

// 根據payment開啟交易
const createPreTransaction = async (req, res) => {
  try {
    const userId = req.user.id;

    return res.status(200).send({ message: null, data: null });
  } catch (error) {
    console.log(error);
    return res.status(500).send("發生錯誤");
  }
};

// 根據payment取消交易 - 錢退回至錢包
const cancelPreTransaction = async (req, res) => {
  try {
    const userId = req.user.id;

    return res.status(200).send({ message: null, data: null });
  } catch (error) {
    console.log(error);
    return res.status(500).send("發生錯誤");
  }
};

module.exports = {
  getPendingPreTransactions,
  createPreTransaction,
  cancelPreTransaction,
};
