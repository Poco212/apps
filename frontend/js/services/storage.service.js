/* ==========================================================================
   Warehouse App - LOCALSTORAGE PERSISTENCE SERVICE
   File: frontend/js/services/storage.service.js
   ========================================================================== */

const StorageService = {
  DB_KEY: 'wms_db',
  SESSION_KEY: 'wms_session',

  // Initialize DB with seed data if not present
  init() {
    if (!localStorage.getItem(this.DB_KEY)) {
      this.saveDB(InventoryModel.defaultData);
    }
  },

  // Get full database object
  getDB() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(this.DB_KEY)) || InventoryModel.defaultData;
    } catch (e) {
      console.error('Failed to parse WMS DB from LocalStorage:', e);
      return InventoryModel.defaultData;
    }
  },

  // Save database object
  saveDB(dbData) {
    localStorage.setItem(this.DB_KEY, JSON.stringify(dbData));
  },

  // Reset database to default initial state
  resetDB() {
    localStorage.setItem(this.DB_KEY, JSON.stringify(InventoryModel.defaultData));
  },

  // Session User Storage Handlers
  getSession() {
    const data = localStorage.getItem(this.SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  setSession(userData) {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(userData));
  },

  clearSession() {
    localStorage.removeItem(this.SESSION_KEY);
  }
};
