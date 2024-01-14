/**
 * Creates a menu with navigation functionality.
 *
 * @param {Object} options - The options for creating the menu.
 * @param {Array} options.pages - An array of DOM elements representing the pages of the menu.
 * @param {Boolean} options.pageVerticality - if the page traversal goes up and down
 * @param {Function} [options.onFocus=(item) => {}] - Callback function triggered when an item is focused.
 * @param {string} [options.itemSelector="a"] - CSS selector to select individual items within the pages.
 * @param {boolean} [options.animations=false] - Boolean indicating whether animations are enabled for item transitions.
 * @param {boolean} [options.animationLength=0] - Length of item transitions.
 * @param {string} [options.focusClass] - Not used in this function.
 * @param {Function} [options.onPageChange=() => {}] - Callback function triggered when the page changes.
 * @returns {Object} - An object containing the methods and properties for the menu.
 */
function createMenu({
	pages,
	pageVerticality,
	onFocus = (item) => { },
	focusClass,
	itemSelector = "a",
	animations = false,
	animationLength = 0,
	onPageChange = () => { },
	forceDp,
} = {}) {
	let p, i, items = [], timeouts = [];

	/**
	 * Navigates to the specified page.
	 *
	 * @param {number} newPage - The index of the new page to navigate to.
	 * @returns {void}
	 */
	function gotoPage(newPage, dp = newPage - p) {
		if (!pages[newPage]) {
			if (onPageChange) {
				onPageChange({
					dp,
					pos: getPos()
				});
			} else {
				console.log("no more pages");
			}
			return;
		}
		if (pages[p]) pages[p].style.display = "none";
		let lastPos = getPos();
		p = newPage;
		pages[p].style.display = null;
		items = getItems(p);

		let rows = [], cols = [];
		for (const item of items) {
			let b = item.getBoundingClientRect();
			if (!rows[Math.round(b.y * 10)]) rows[Math.round(b.y * 10)] = [];
			rows[Math.round(b.y * 10)].push(items.indexOf(item));
			if (!cols[Math.round(b.x * 10)]) cols[Math.round(b.x * 10)] = [];
			cols[Math.round(b.x * 10)].push(items.indexOf(item));
		}
		rows = rows.filter(i => !!i);
		cols = cols.filter(i => !!i);
		for (let r in rows) {
			for (let i of rows[r]) {
				if (!items[i].dataset.y) items[i].dataset.y = r;
			}
		}
		for (let c in cols) {
			for (let i of cols[c]) {
				if (!items[i].dataset.x) items[i].dataset.x = c;
			}
		}
		for (const item of items) {
			const { x, y } = item.dataset;
			item.tabIndex = (Number(y) * cols.length) + Number(x);
		}
		i = 0;
		if (rows.length === 3 && cols.length === 3) {
			i = 4;
		}
		const xy = pageVerticality ? "x" : "y";
		const cr = pageVerticality ? cols : rows;
		if (lastPos && dp) {
			let r;
			do {
				r = cr[lastPos[xy]];
				lastPos[xy]--;
			} while (!r || r.length === 0);
			i = !!(Math.sign(dp) + 1) ? r[0] : r[r.length - 1];
			console.log(r);

		}
		updateFocus();
	}

	/**
	 *
	 * @param {Boolean} vp - sets weather the pages traverse virtically
	 */
	function setVerticality(vp) {
		pageVerticality = vp;
	}

	/**
	 * Sets the pages of the menu and initializes the menu.
	 *
	 * @param {Array} newPages - An array of DOM elements representing the new pages of the menu.
	 * @returns {void}
	 */
	function setPages(newPages, fdp = forceDp) {
		pages = newPages;
		if (!Array.isArray(pages)) pages = Array.from(pages);
		pages.forEach(page => page.style.display = "none");
		gotoPage(0, fdp);
	}

	/**
	 * Traverses the menu in the specified direction.
	 *
	 * @param {number} dx - The movement in the x-axis (horizontal direction).
	 * @param {number} dy - The movement in the y-axis (vertical direction).
	 * @returns {void}
	 */
	function traverse(dx, dy) {
		if (!items | !items.length) {
			console.warn("no items");
			return;
		}
		let current = items[i];
		if (!current) {
			console.warn("no current item");
			return;
		}
		let
			cb = current.getBoundingClientRect(),
			cx = (cb.left + cb.right) / 2,
			cy = (cb.top + cb.bottom) / 2;

		let rels = items.map((e, i) => {
			let eb = e.getBoundingClientRect(),
				ex = (eb.left + eb.right) / 2,
				ey = (eb.top + eb.bottom) / 2,
				mx = dx > 0 // right
					? eb.left - cb.right
					: dx < 0 // left
						? cb.left - eb.right
						: ex - cx,
				my = dy > 0 // down
					? eb.top - cb.bottom
					: dy < 0 //up
						? cb.top - eb.bottom
						: ey - cy,
				m = Math.sqrt(mx * mx + my * my),
				ux = mx / m,
				uy = my / m;

			return { i, e, ux, uy, m, my, mx };

		});

		// eslint-disable-next-line eqeqeq
		rels = rels.filter(e => (e.i !== i) && (!dx || e.ux > 0) && (!dy || e.uy > 0));
		rels = rels.sort((a, b) => a.m - b.m).sort((a, b) => (dx ? a.mx - b.mx : dy ? a.my - b.my : a.m - b.m));

		if (!rels.length) {
			console.log({ dx, dy });
			if (pageVerticality ? dy > 0 : dx > 0) {
				nextPage();
			} if (pageVerticality ? dy < 0 : dx < 0) {
				lastPage();
			}
			return;
		}
		if (focusClass) getSelected().classList.remove(focusClass);
		i = rels[0].i;
		let item = rels[0].e;
		if (focusClass) item.classList.add(focusClass);

		if (animations && Math.sqrt(dx * dx + dy * dy) === 1) {
			//Update Animations
			if (dy > 0) item.classList.add("down");
			if (dy < 0) item.classList.add("up");
			if (dx > 0) item.classList.add("right");
			if (dx < 0) item.classList.add("left");
			// fixes a bug where when you mouse over something
			// previously focussed with the keyboard it replays
			// movement animation
			timeouts.push(setTimeout(() => {
				item.classList.remove("left", "right", "up", "down");
			}, 0));

			//Moving
			item.classList.add("moving");
			timeouts.push(setTimeout(() => {
				item.classList.remove("moving");
			}, animationLength));
		}
		updateFocus();
	}

	/**
	 * @returns {void}
	 */
	function clearTimeouts() {
		while (timeouts.length) {
			clearTimeout(timeouts.shift());
		}
	}

	/**
	 * Updates the focus on the current item and triggers the onFocus callback.
	 *
	 * @returns {void}
	 */
	function updateFocus() {
		let current = items[i];

		if (!current) return;
		current.focus({ focusVisible: true });
		onFocus(current);
	}

	/**
	 * Initializes the menu by setting the pages and the current page to the first page.
	 *
	 * @returns {void}
	 */
	function init() {
		setPages(pages);
	}

	/**
	 * Navigates to the next page.
	 *
	 * @returns {void}
	 */
	function nextPage() {
		gotoPage(p + 1);
	}

	/**
	 * Navigates to the previous page.
	 *
	 * @returns {void}
	 */
	function lastPage() {
		gotoPage(p - 1);
	}

	/**
	 * Traverses the menu to the left.
	 *
	 * @returns {void}
	 */
	function left() {
		traverse(-1, 0);
	}

	/**
	 * Traverses the menu to the right.
	 *
	 * @returns {void}
	 */
	function right() {
		traverse(1, 0);
	}

	/**
	 * Traverses the menu upwards.
	 *
	 * @returns {void}
	 */
	function up() {
		traverse(0, -1);
	}

	/**
	 * Traverses the menu downwards.
	 *
	 * @returns {void}
	 */
	function down() {
		traverse(0, 1);
	}

	/**
	 * Navigates to the specified item in the menu.
	 *
	 * @param {HTMLElement} item - The DOM element representing the item to navigate to.
	 * @returns {void}
	 */
	function goto(item) {
		i = items.indexOf(item);
		updateFocus();
	}

	/**
	 * Gets the array of pages in the menu.
	 *
	 * @returns {Array} - An array of DOM elements representing the pages of the menu.
	 */
	function getPages() {
		return pages;
	}

	/**
	 * Gets the items in the specified page.
	 *
	 * @param {number} p - The index of the page.
	 * @returns {Array} - An array of DOM elements representing the items in the page.
	 */
	function getItems(p) {
		return Array.from(pages[p].querySelectorAll(itemSelector));
	}

	/**
	 * Gets the index of an item in the menu based on its data-x and data-y attributes.
	 *
	 * @param {Object} pos - The position object containing the x and y attributes.
	 * @param {number} pos.x - The x-coordinate of the item.
	 * @param {number} pos.y - The y-coordinate of the item.
	 * @returns {number} - The index of the item in the menu.
	 */
	function getItem({ x, y }) {
		return items.findIndex(i => i.x === x && i.y === y);
	}

	/**
	 * Gets the currently focused item in the menu.
	 *
	 * @returns {HTMLElement} - The DOM element representing the currently focused item.
	 */
	function getSelected() {
		return items[i];
	}

	/**
	 * Gets the current position (data-x and data-y attributes) of the focused item.
	 *
	 * @returns {Object} - The position object containing the x and y attributes.
	 */
	function getPos() {
		let current = items[i];
		if (!current || !current.dataset) return;
		let { x, y } = current.dataset;
		return { x, y };
	}

	/**
	 * Sets the onPageChange callback function.
	 *
	 * @param {Function} fn - The onPageChange callback function.
	 * @returns {void}
	 */
	function setOnPageChange(fn) {
		onPageChange = fn;
	}

	// Initialize the menu and return an object containing all the public methods and properties.
	return {
		nextPage,
		lastPage,
		left,
		right,
		up,
		down,
		getSelected,
		getItems,
		goto,
		init,
		getPages,
		setPages,
		getPos,
		getItem,
		setOnPageChange,
		setVerticality,
		clearTimeouts
	};
}

export default createMenu;
