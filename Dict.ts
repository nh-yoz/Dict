/**
* Dictionnary class used for fast search and find
* Uses an array with a divide and conquer algorithm
* Stores unique values
*/
export class Dict {
    private arr: unknown[] = [];

    private compareFn: (a: unknown, b: unknown) => number;

    /**
     * Dictionnary class used for fast search and find
     * Uses an array with a divide and conquer algorithm
     * Stores unique values
     * @constructor
     * @param {(a: unknown, b: unknown) => number} compareFn - Function used to determine the order of the elements. It is expected to return a negative value if the first argument is
     * less than the second argument, zero if they're equal, and a positive value otherwise.
     * @param {Array.<unknown>} [initArray] - Optional, add items at construction
    */
    constructor(compareFn: (a:unknown, b:unknown) => number, initArray?: unknown[]) {
        this.compareFn = compareFn;
        if (initArray) {
            initArray.forEach(item => this.add(item));
        }
    }

    private indexOf = (item: unknown, exact: boolean): number => {
        // search for a value in an ascending sorted array
        if (this.arr.length === 0) {
            return -1;
        }
        if (this.compareFn(item, this.arr[0]) < 0) {
            return exact ? -1 : -0.5;
        }
        if (this.compareFn(item, this.arr[this.arr.length - 1]) > 0) {
            return exact ? -1 : this.arr.length;
        }
        let minIdx = 0;
        let maxIdx = this.arr.length - 1;
        let foundIdx = -1;
        while (minIdx <= maxIdx) {
            const midIdx = Math.floor((minIdx + maxIdx) / 2);
            const testResult = this.compareFn(item, this.arr[midIdx]);
            if (testResult < 0) {
                maxIdx = midIdx - 1;
            } else if (testResult > 0) {
                minIdx = midIdx + 1;
            } else if (testResult === 0) {
                foundIdx = midIdx;
                break;
            } else {
                break;
            }
        }
        if (foundIdx === -1 && !exact) {
            // return value = -1 : array is empty
            // return value = < 0 : not found, result is in index below 0
            // return value = array.length : not found, result is beyond last index
            // return value is integer : found
            // otherwise (floating point ]0, array.length -1[) : not found, value between indexes
            return (minIdx + maxIdx) / 2;
        }
        return foundIdx;
    };

    private add = (item: unknown, force = false): void => {
        const idx = this.indexOf(item, false);
        if (idx === -1 || idx === this.arr.length) {
            this.arr.push(item);
        } else if (idx % 1 !== 0) {
            this.arr.splice(Math.floor(idx + 1), 0, item);
        } else if (force) {
            // already in array but replace with new one
            this.arr.splice(idx, 1, item);
        }
    };

    private remove = (item: unknown): void => {
        const idx = this.indexOf(item, true);
        if (idx === -1) {
            return;
        }
        this.arr.splice(idx, 1);
    };

    public addItem = (item: unknown | unknown[], force = false): void => {
        if (Array.isArray(item)) {
            item.forEach(i => this.add(i, force));
        } else {
            this.add(item, force);
        }
    };

    public exists = (item: unknown): boolean => {
        return this.indexOf(item, true) !== -1;
    };

    public removeItem = (item: unknown | unknown[]): void => {
        if (Array.isArray(item)) {
            item.forEach(item => this.remove(item));
        } else {
            this.remove(item);
        }
    };

    public find = (item: unknown): unknown | undefined => {
        const idx = this.indexOf(item, true);
        if (idx === -1) {
            return undefined;
        }
        return this.arr[idx];
    };

    get array(): unknown[] {
        return [...this.arr];
    }

    get length(): number {
        return this.arr.length;
    }
}

export default Dict;
