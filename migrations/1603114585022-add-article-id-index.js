const db = require('../migration-utils/db');

module.exports.up = async function () {
  const connectedDb = await db();
  await connectedDb.collection('articles').createIndex({ articleId: 1 });
}

module.exports.down = async function () {
  const connectedDb = await db();
  await connectedDb.collection('articles').dropIndex('articleId_1');
}
