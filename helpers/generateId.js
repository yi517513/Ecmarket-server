const Counter = require("../models/counter");

async function generateId(sequenceName) {
  const result = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return result.seq;
}

module.exports = generateId;
