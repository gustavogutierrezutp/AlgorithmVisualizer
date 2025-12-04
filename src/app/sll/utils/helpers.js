/**
 * Utility function to pause execution for animation timing
 * @param {number} ms - milliseconds to sleep
 * @returns {Promise} Promise that resolves after the specified time
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
