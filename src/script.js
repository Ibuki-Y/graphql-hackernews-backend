// データベースにアクセスするためのクライアントライブラリ
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // .link: schema.prismaのmodel名
  const newLink = await prisma.link.create({
    data: {
      description: 'This is description',
      url: 'https://localhost:4000',
    },
  });
  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
}

main()
  .catch((e) => {
    throw e;
  }) // finally: エラーがあってもなくても実行
  .finally(async () => {
    // データベースを閉じる
    prisma.$disconnect;
  });
