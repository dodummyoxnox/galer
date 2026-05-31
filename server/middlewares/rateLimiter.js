const ipCache = new Map();

/**
 * In-memory rate limiter middleware
 * @param {number} windowMs Time window in milliseconds (default 1 minute)
 * @param {number} maxRequests Maximum requests allowed per window (default 3 requests)
 */
export function rateLimiter(windowMs = 60 * 1000, maxRequests = 3) {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!ipCache.has(ip)) {
      ipCache.set(ip, []);
    }

    // Clean up timestamps outside the window
    const timestamps = ipCache.get(ip).filter((ts) => now - ts < windowMs);

    if (timestamps.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Terlalu banyak mengirim pesan. Silakan coba lagi setelah satu menit.',
      });
    }

    timestamps.push(now);
    ipCache.set(ip, timestamps);
    next();
  };
}
