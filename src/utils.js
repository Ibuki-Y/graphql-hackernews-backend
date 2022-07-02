const jwt = require('jsonwebtoken');
require('dotenv').config();
const { APP_SECRET } = process.env;

/* Tokenの複合関数 */
function getTokenPayload(token) {
  // Token化される前の情報(user.id)を複合
  return jwt.verify(token, APP_SECRET);
}

/* ユーザーIDを取得関数 */
function getUserId(req, authToken) {
  if (req) {
    // ヘッダーを確認(authorization)
    const authHeader = req.headers.authorization;
    if (authHeader) {
      // "Bearer token" => "token"
      const token = authHeader.replace('Bearer', '');
      if (!token) {
        throw new Error('Token not found.');
      }

      // Tokenの複合
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error('You do not have authorization.');
}

module.exports = {
  getUserId,
};
