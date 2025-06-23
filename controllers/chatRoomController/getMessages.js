const { MessageModel } = require("../../models");

const getMessages = async (req, res, next) => {
  try {
    const { recipientId, cursor, limit } = req.query || {};
    const currentUserId = req.user?._id;

    // 找出第一筆未讀
    const firstUnread = await MessageModel.findOne({
      to: currentUserId,
      from: recipientId,
      isRead: false,
    }).sort({ createdAt: 1 });

    // 該筆在降序列表中的 index
    const firstUnreadIndex = firstUnread
      ? await MessageModel.countDocuments({
          $or: [
            { from: currentUserId, to: recipientId },
            { from: recipientId, to: currentUserId },
          ],
          createdAt: { $gt: firstUnread.createdAt },
        })
      : -1;

    // 若未讀訊息超過 20 筆就要多撈一點，上限 50
    const parsedLimit = Number(limit) || 20;
    const realLimit = Math.min(50, Math.max(firstUnreadIndex + 1, parsedLimit));
    const messages = await MessageModel.find({
      $or: [
        { from: currentUserId, to: recipientId },
        { from: recipientId, to: currentUserId },
      ],
      ...(cursor ? { createdAt: { $lt: new Date(cursor) } } : {}),
    })
      .sort({ createdAt: -1 }) // 降序 最新的在前
      .limit(realLimit + 1); // 多抓一筆判斷是否還有下一頁

    const hasNext = messages.length > realLimit;
    const slicedMessages = hasNext ? messages.slice(0, realLimit) : messages;
    slicedMessages.reverse(); // reverse 成升序

    const nextCursor = hasNext ? slicedMessages[0]?.createdAt : undefined;

    return res
      .status(200)
      .json({ data: { messages: slicedMessages, nextCursor } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMessages };
