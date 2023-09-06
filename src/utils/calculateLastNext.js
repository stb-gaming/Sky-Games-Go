/**
 * Finds the previous and next elements in an array or a range of items based on the given current element or number.
 *
 * @template T
 * @param {T} current - The current element (in case of an array) or number.
 * @param {Array<T>} items - The array of elements or the length of the range.
 * @param {number} length - The length of the range (if items is a number).
 * @param {number} [modOffset=0] - An optional offset value for modulo calculations.
 * @returns {{ last: T, next: T }} - An object containing the 'last' and 'next' elements/numbers.
 */
export default function calculateLastNext(current, items, length, modOffset = 0) {
	//console.debug({ current, items, length, modOffset });
	let last = 0;
	let next = 0;

	if (Array.isArray(items) && items.includes(current)) {
		let currentIndex = items.indexOf(current);
		last = items[(currentIndex - 1 + items.length) % items.length];
		next = items[(currentIndex + 1) % items.length];
	} else if (typeof current === "number") {
		const mod = (a, b) => ((a - modOffset + b) % b) + modOffset;
		last = mod(current - 1, length);
		next = mod(current + 1, length);
	}

	return { last, next };
}
