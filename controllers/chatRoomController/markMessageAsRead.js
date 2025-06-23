const { MessageModel, ChatSummaryModel } = require("../../models");
const { eventBus } = require("../../events/eventBus");

const markMessageAsRead = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { messageIds } = req.body;

    // 標記已讀
    const { modifiedCount } = await MessageModel.updateMany(
      { _id: { $in: messageIds } },
      { $set: { isRead: true } }
    );

    // 從任一筆訊息取出對方的 userId
    const sampleMessage = await MessageModel.findOne(
      { _id: { $in: messageIds } },
      { from: 1 }
    );

    const peerId = sampleMessage?.from?.toString();

    const updatedSummaryRaw = await ChatSummaryModel.findOneAndUpdate(
      { owner: userId, peer: peerId },
      { $inc: { unreadCount: -modifiedCount } },
      { new: true }
    ).populate({ path: "peer", select: "_id uid username" });

    const updatedSummary = updatedSummaryRaw?.toJSON?.();

    eventBus.emit("events:chat:updateSummary", {
      targetUserIds: [userId],
      summaries: { [userId]: updatedSummary },
    });

    return res.status(200).json({ message: null, data: null });
  } catch (error) {
    next(error);
  }
};

module.exports = { markMessageAsRead };
