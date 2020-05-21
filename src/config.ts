export const config = {
  port: +process.env.PORT || 4000,
  apiPrivateKey: process.env.API_PRIVATE_KEY || '5Ka37rgWMY3EVjmkoMWpcBFuBqSYDqxY9vFnu4DbCkmruGCdsQj',
  apiMailKey: process.env.API_MAIL_KEY || '2749d1ccda9702b52fa49d6d5984b9ad12bd3e5fe652cb3d32b4160f0cf4665a',
  apiMailRootId: '46dbe313-a9a5-4154-bd25-34c5b6ff6b4f',
  rpcUrl: process.env.RPC_URL || 'http://localhost:8888',
  contractName: 'mailprovider',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  pollingRepeatEvery: 5000,
}