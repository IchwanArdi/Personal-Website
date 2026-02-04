const Redis = require('ioredis');

// Pastikan REDIS_URL ada di .env
const REDIS_URL = process.env.REDIS_URL;

let redis;

if (REDIS_URL) {
  // Opsi khusus untuk Redis Labs / Vercel KV jika diperlukan (biasanya URL string cukup)
  redis = new Redis(REDIS_URL, {
    // Retry strategy jika koneksi putus
    retryStrategy: function (times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    // TLS settings (otomatis aktif jika URL pakai rediss://, tapi untuk beberapa provider perlu eksplisit)
    // Untuk Redis Labs biasanya URL saja cukup
    maxRetriesPerRequest: 3,
  });

  redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
  });
} else {
  console.warn('⚠️ REDIS_URL not found in .env. Caching will be disabled.');
  // Mock redis interface agar app tidak crash jika Redis tidak ada
  redis = {
    get: async () => null,
    set: async () => null,
    setex: async () => null,
    del: async () => null,
    flushall: async () => null,
    quit: async () => null,
  };
}

module.exports = redis;
