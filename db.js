/* ============================================================
   RAHMA APP — db.js
   Local IndexedDB handling for privacy-first data storage
   ============================================================ */

const DB_NAME = 'RahmaDB';
const DB_VERSION = 1;

const STORES = {
  PRAYERS: 'prayers',
  TASBIH: 'tasbih',
  CACHE: 'cache'
};

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = event => {
      console.error("IndexedDB error:", event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = event => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = event => {
      const db = event.target.result;
      
      // Store: prayers -> key is YYYY_MM_DD
      if (!db.objectStoreNames.contains(STORES.PRAYERS)) {
        db.createObjectStore(STORES.PRAYERS, { keyPath: 'dateId' });
      }
      
      // Store: tasbih -> key is dhikr index
      if (!db.objectStoreNames.contains(STORES.TASBIH)) {
        db.createObjectStore(STORES.TASBIH, { keyPath: 'id' });
      }
      
      // Store: cache -> generic key-value
      if (!db.objectStoreNames.contains(STORES.CACHE)) {
        db.createObjectStore(STORES.CACHE, { keyPath: 'id' });
      }
    };
  });
}

// ── PRAYERS API ──
window.RahmaDB = {
  dbPromise: initDB(),

  async getPrayers(dateId) {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.PRAYERS], 'readonly');
      const store = transaction.objectStore(STORES.PRAYERS);
      const request = store.get(dateId);
      
      request.onsuccess = () => resolve(request.result?.data || {});
      request.onerror = () => reject(request.error);
    });
  },

  async savePrayers(dateId, data) {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.PRAYERS], 'readwrite');
      const store = transaction.objectStore(STORES.PRAYERS);
      const request = store.put({ dateId, data });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async getAllPrayers() {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.PRAYERS], 'readonly');
      const store = transaction.objectStore(STORES.PRAYERS);
      const request = store.getAll();
      
      request.onsuccess = () => {
        // Return as an object map: { '2026_2_14': { fajr: true, ... } }
        const map = {};
        if (request.result) {
          request.result.forEach(item => {
            map[item.dateId] = item.data;
          });
        }
        resolve(map);
      };
      request.onerror = () => reject(request.error);
    });
  },

  // ── TASBIH API ──
  async getTasbihData(id) {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.TASBIH], 'readonly');
      const store = transaction.objectStore(STORES.TASBIH);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result || { id, count: 0, session: 0, history: [] });
      request.onerror = () => reject(request.error);
    });
  },

  async saveTasbihData(id, count, session, history) {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.TASBIH], 'readwrite');
      const store = transaction.objectStore(STORES.TASBIH);
      const request = store.put({ id, count, session, history });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  // ── CACHE API ──
  async getCache(id) {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.CACHE], 'readonly');
      const store = transaction.objectStore(STORES.CACHE);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result?.value || null);
      request.onerror = () => reject(request.error);
    });
  },

  async saveCache(id, value) {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORES.CACHE], 'readwrite');
      const store = transaction.objectStore(STORES.CACHE);
      const request = store.put({ id, value });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
};
