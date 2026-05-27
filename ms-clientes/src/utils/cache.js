class SimpleCache {
  constructor(ttlMs = 30000) {
    this.cache = new Map();
    this.ttlMs = ttlMs;
  }

  set(key, data) {
    this.cache.set(String(key), {
      data,
      expires: Date.now() + this.ttlMs
    });
  }

  get(key) {
    const cached = this.cache.get(String(key));
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    if (cached) this.cache.delete(String(key));
    return null;
  }

  delete(key) {
    this.cache.delete(String(key));
  }

  clear() {
    this.cache.clear();
  }
}

export default SimpleCache;
