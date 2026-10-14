/**
 * IndexedDB storage for persistent image uploads
 * Allows storing large screenshots and component images persistently without localStorage quota limits.
 */

const DB_NAME = 'vault_image_store';
const STORE_NAME = 'images';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const imageDB = {
  /**
   * Save an image (dataURL string or Blob) into IndexedDB.
   * Returns a reference key formatted as "idb:<key>"
   */
  async saveImage(id: string, data: string | Blob): Promise<string> {
    const db = await openDB();
    const key = `img_${id}`;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(data, key);

      request.onsuccess = () => resolve(`idb:${key}`);
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Retrieve an image by key or reference string (e.g. "idb:img_123" or "img_123").
   * Returns a displayable URL (dataURL or Object URL) or null if not found.
   */
  async getImage(reference: string): Promise<string | null> {
    if (!reference) return null;
    if (reference.startsWith('http://') || reference.startsWith('https://') || reference.startsWith('data:')) {
      return reference;
    }

    const key = reference.startsWith('idb:') ? reference.slice(4) : reference;

    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onsuccess = () => {
          const result = request.result;
          if (!result) {
            resolve(null);
            return;
          }

          if (typeof result === 'string') {
            resolve(result); // Base64 dataURL
          } else if (result instanceof Blob) {
            resolve(URL.createObjectURL(result));
          } else {
            resolve(null);
          }
        };

        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.error('Failed to read image from IndexedDB:', err);
      return null;
    }
  },

  /**
   * Delete an image from IndexedDB
   */
  async deleteImage(reference: string): Promise<void> {
    if (!reference || (!reference.startsWith('idb:') && !reference.startsWith('img_'))) {
      return;
    }

    const key = reference.startsWith('idb:') ? reference.slice(4) : reference;

    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.error('Failed to delete image from IndexedDB:', err);
    }
  },

  /**
   * Clear all stored images
   */
  async clearAll(): Promise<void> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.error('Failed to clear IndexedDB:', err);
    }
  },
};
