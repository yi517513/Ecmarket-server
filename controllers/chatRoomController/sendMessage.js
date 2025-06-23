const { MessageModel, ChatSummaryModel } = require("../../models");
const { eventBus } = require("../../events/eventBus");

const sendMessage = async (req, res, next) => {
  try {
    const { recipientId, content } = req.body || {};

    const userId = req.user?._id;

    const newMessage = await MessageModel.create({
      from: userId,
      to: recipientId,
      content,
    });

    const lastTime = new Date();

    const [senderSummaryRaw, recipientSummaryRaw] = await Promise.all([
      ChatSummaryModel.findOneAndUpdate(
        { owner: userId, peer: recipientId },
        { $set: { lastMessage: content, lastTime } },
        { new: true, upsert: true }
      ).populate({ path: "peer", select: "_id uid username" }),
      ChatSummaryModel.findOneAndUpdate(
        { owner: recipientId, peer: userId },
        {
          $set: { lastMessage: content, lastTime },
          $inc: { unreadCount: 1 },
        },
        { new: true, upsert: true }
      ).populate({ path: "peer", select: "_id uid username" }),
    ]);

    const senderSummary = senderSummaryRaw?.toJSON?.();
    const recipientSummary = recipientSummaryRaw?.toJSON?.();

    // io.to 更新 summary
    eventBus.emit("events:chat:updateSummary", {
      targetUserIds: [userId, recipientId],
      summaries: {
        [userId]: senderSummary,
        [recipientId]: recipientSummary,
      },
    });

    // 發送訊息
    eventBus.emit("events:chat:sendMessage", {
      targetUserIds: [userId, recipientId],
      message: newMessage,
    });

    // 通知前端有訊息
    eventBus.emit("events:chat:notify", { targetUserId: recipientId });

    return res.status(200).json({ message: null, data: null });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage };
