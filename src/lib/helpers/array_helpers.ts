/**
 * A set of monkey-patched Array helpers.
 * Probably a bad idea to use these in a real production environment.
 * Monkey-patching is confusing to anyone seeing project for the first
 * time (or coming back to it after a few weeks).
 * That said, this is a simple demo project, so what the hell, let's break
 * some rules =D
 */

declare global {
  interface Array<T> {
    swap(a: number, b: number): this;
    range(n: number): number[];
    matrix(x: number, y: number): number[][];
  }
}

/**
 * Array.prototype.swap
 * Rearrange an array to swap positions of two elements.
 * @param {Number} a - index of first element to swap.
 * @param {Number} b - index of second element to swap.
 * @returns {Array}
 * @example
 * // returns [ 'a', 'c', 'b' ]
 * [ 'a', 'b', 'c' ].swap(1, 2)
 */
Array.prototype.swap = function(this: any[], a: number, b: number) {
    if ( b >= this.length || b < 0 ) return this;

    // Temporary variable to hold data while we juggle
    let temp = this[a];
    this[a] = this[b];
    this[b] = temp;
    return this;
};

/**
 * Array.range
 * Create a new array of length n, where elements are numbers
 * from 0 to n - 1.
 * @param {Number} n - desired length of the range.
 * @returns {Array}
 * @example
 * // returns [ 0, 1, 2, 3 ]
 * Array.range(4);
 */
Array.prototype.range = function(this: any[], n: number) {
    return Array.from(new Array(n), (_, i) => i);
};

/**
 * Array.matrix
 * Create a new two-dimensional array, where each element is its own index.
 * @param {Number} x - desired number of columns (possible x values)
 * @param {Number} y - desired number of rows (possible y values)
 * @returns {Array}
 * @example
 * // returns [
 * //   [ 0, 1, 2 ],
 * //   [ 0, 1, 2 ]
 * // ]
 * Array.matrix(3, 2);
 */
Array.prototype.matrix = function(this: any[], x: number, y: number) {
    const rows = this.range(y);
    const columns = this.range(x);
    return rows.map( () => columns.slice() );
};

export {};
