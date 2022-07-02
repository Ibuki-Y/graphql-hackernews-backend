const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { APP_SECRET } = process.env;

/* ニュース投稿(リゾルバ) */
async function post(parent, args, context) {
  const { userId } = context;

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });

  // 送信(publish)
  context.pubsub.publish('NEW_LINK', newLink);

  // Link
  return newLink;
}

/* ユーザー新規登録(リゾルバ) */
async function signup(parent, args, context) {
  // パスワードの設定(bcryptjs)
  const password = await bcrypt.hash(args.password, 10); // hash化

  // ユーザーの新規作成
  const user = await context.prisma.user.create({
    data: {
      // hash化したパスワードに更新
      ...args,
      password,
    },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // AuthPayload
  return {
    token,
    user,
  };
}

/* ユーザーログイン(リゾルバ) */
async function login(parent, args, context) {
  // findUnique: 一致するものを見つける(prisma)
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error('No such user exists.');
  }

  // パスワードの比較
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password.');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // AuthPayload
  return {
    token,
    user,
  };
}

/* いいね(リゾルバ) */
async function vote(parent, args, context) {
  // const userId = context.userId;
  const { userId } = context;

  // const vote = context.prisma.vote.findUnique({
  //   where: {
  //     linkId_userId: {
  //       linkId: Number(args.linkId),
  //       userId: userId,
  //     },
  //   },
  // });

  // いいね重複を防ぐ
  // if (Boolean(vote)) {
  //   throw new Error(`${args.linkId} is voted.`);
  // }

  // いいねする
  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } },
    },
  });

  // 送信
  context.pubsub.publish('NEW_VOTE', newVote);

  return newVote;
}

module.exports = {
  post,
  signup,
  login,
  vote,
};
