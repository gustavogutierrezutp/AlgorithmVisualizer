/**
 * Utility functions for array manipulation.
 * Formerly monkey-patched onto Array.prototype.
 */

/**
 * Rearrange an array to swap positions of two elements.
 * @param array - The array to modify used to be 'this'
 * @param a - index of first element to swap.
 * @param b - index of second element to swap.
 * @returns The modified array
 */
export function swap<T>(array: T[], a: number, b: number): T[] {
  if (b >= array.length || b < 0) return array;

  // Temporary variable to hold data while we juggle
  const temp = array[a];
  array[a] = array[b];
  array[b] = temp;
  return array;
}

/**
 * Create a new array of length n, where elements are numbers
 * from 0 to n - 1.
 * @param n - desired length of the range.
 * @returns Array of numbers
 */
export function range(n: number): number[] {
  return Array.from(new Array(n), (_, i) => i);
}

/**
 * Create a new two-dimensional array, where each element is its own index.
 * @param x - desired number of columns (possible x values)
 * @param y - desired number of rows (possible y values)
 * @returns 2D Array
 */
export function matrix(x: number, y: number): number[][] {
  const rows = range(y);
  const columns = range(x);
  return rows.map(() => columns.slice());
}

