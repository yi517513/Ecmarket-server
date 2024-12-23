// 取消已開啟的交易
const deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.id;

    return res.status(200).send({ message: null, data: awaitingProducts });
  } catch (error) {
    console.error(error);
    return res.status(500).send("發生錯誤");
  }
};

// 賣家確認出貨
const confirmShipment = async (req, res) => {
  try {
    const userId = req.user.id;

    return res.status(200).send({ message: null, data: awaitingProducts });
  } catch (error) {
    console.error(error);
    return res.status(500).send("發生錯誤");
  }
};

// 買家確認收貨
const confirmReceive = async (req, res) => {
  try {
    const userId = req.user.id;

    return res.status(200).send({ message: null, data: awaitingProducts });
  } catch (error) {
    console.error(error);
    return res.status(500).send("發生錯誤");
  }
};

module.exports = {
  deleteTransaction,
  confirmShipment,
  confirmReceive,
};
