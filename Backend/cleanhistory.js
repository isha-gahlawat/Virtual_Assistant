
const User = require('./models/usermodel');

const cleanInvalidHistory = async () => {
  try {
    const users = await User.find();

    let cleanedCount = 0;

    for (let user of users) {
      const originalLength = user.history.length;

      user.history = user.history.filter(
        (h) => typeof h.question === 'string' && h.question.trim()
      );

      if (user.history.length !== originalLength) {
        await user.save();
        cleanedCount++;
        console.log(`✅ Cleaned history for: ${user.email}`);
      }
    }

    console.log(`✅ Total users cleaned: ${cleanedCount}`);
  } catch (err) {
    console.error("❌ Error cleaning user history:", err.message);
  }
};

module.exports = cleanInvalidHistory;
