// Utility functions for working with localStorage

/**
 * Get a value from localStorage
 * @param {string} key - The key to get
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} - The value from localStorage or defaultValue
 */
export function getFromLocalStorage(key, defaultValue = null) {
  if (typeof window === "undefined") return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Set a value in localStorage
 * @param {string} key - The key to set
 * @param {any} value - The value to store
 * @returns {boolean} - Whether the operation was successful
 */
export function setInLocalStorage(key, value) {
  if (typeof window === "undefined") return false;

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
    return false;
  }
}

/**
 * Remove a value from localStorage
 * @param {string} key - The key to remove
 * @returns {boolean} - Whether the operation was successful
 */
export function removeFromLocalStorage(key) {
  if (typeof window === "undefined") return false;

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
}

/**
 * Get all billing transactions from localStorage
 * @returns {Array} - Array of transaction objects
 */
export function getBillingTransactions() {
  return getFromLocalStorage("billingTransactions", []);
}

/**
 * Add a billing transaction to localStorage
 * @param {Object} transaction - The transaction to add
 * @returns {Object} - The added transaction with ID and date
 */
export function addBillingTransaction(transaction) {
  const transactions = getBillingTransactions();

  const newTransaction = {
    ...transaction,
    id: `tx_${Date.now()}`,
    date: new Date().toISOString(),
  };

  transactions.unshift(newTransaction);
  setInLocalStorage("billingTransactions", transactions);

  return newTransaction;
}
