function createMenu({
	pages,
	onFocus = (item) => { },
	itemSelector = "a",
	animations = false,
	onPageChange = () => { }
}) {
	let p, i, items = [];


	function gotoPage(newPage) {
		if (!pages[newPage]) {
			if (onPageChange) {
				onPageChange({
					dp: newPage - p,
					pos: getPos()
				});
			} else {

				console.log("no more pages");
			}
			return;
		}
		if (pages[p]) pages[p].style.display = "none";
		let lastPos = getPos();
		let dp = newPage - p;
		//console.log({ p, newPage, dp });
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
				items[i].dataset.y = r;
			}
		}
		for (let c in cols) {
			for (let i of cols[c]) {
				items[i].dataset.x = c;
			}
		}

		i = 0;
		if (lastPos && dp) {
			let r;
			while (!r || r.length == 0) {
				r = rows[lastPos.y];
				lastPos.y--;
			}
			//console.log({ lastPos, r, dp });
			i = dp > 0 ? r[0] : r[r.length - 1];
		}
		//console.log(i);
		updateFocus();
	}
	function setPages(newPages) {
		pages = newPages;
		if (!Array.isArray(pages)) pages = Array.from(pages);
		pages.forEach(page => page.style.display = "none");
		gotoPage(0);
	}

	function traverse(dx, dy) {
		if (!items | !items.length) {
			console.warn("no items");
			return;
		};
		let current = items[i];
		if (!current) {
			console.warn("no current item");
			return;
		}
		let
			cb = current.getBoundingClientRect(),
			cx = (cb.left + cb.right) / 2,
			cy = (cb.top + cb.bottom) / 2;
		//console.log({ current, cx, cy });

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
		rels = rels.filter(e => (e.i != i) && (!dx || e.ux > 0) && (!dy || e.uy > 0));
		rels = rels.sort((a, b) => a.m - b.m).sort((a, b) => (dx ? a.mx - b.mx : dy ? a.my - b.my : a.m - b.m));

		//console.log(rels);
		if (!rels.length) {
			if (dx > 0) {
				nextPage();
			} if (dx < 0) {
				lastPage();
			}
			return;
		};
		i = rels[0].i;
		let item = rels[0].e;

		if (animations && Math.sqrt(dx * dx + dy * dy) == 1) {
			//Update Animations
			if (dy > 0) item.classList.add("down");
			if (dy < 0) item.classList.add("up");
			if (dx > 0) item.classList.add("right");
			if (dx < 0) item.classList.add("left");
			// fixes a bug where when you mouse over something
			// previously focussed with the keyboard it replays
			// movement animation
			setTimeout(() => {
				item.classList.remove("left", "right", "up", "down");
			}, 0);
		}


		//Update Item Focus
		updateFocus();
	}

	function updateFocus() {
		let current = items[i];

		if (!current) return;
		current.focus({ focusVisible: true });
		onFocus(current);
	}

	function init() {
		setPages(pages);
	}



	function nextPage() {
		gotoPage(p + 1);
	}

	function lastPage() {
		gotoPage(p - 1);

	}

	function left() {
		traverse(-1, 0);
	}

	function right() {
		traverse(1, 0);
	}

	function up() {
		traverse(0, -1);
	}

	function down() {
		traverse(0, 1);
	}

	function goto(item) {
		i = items.indexOf(item);
		updateFocus();
	}



	function getPages() {
		return pages;
	}

	function getItems(p) {
		return Array.from(pages[p].querySelectorAll(itemSelector));
	}

	function getItem({ x, y }) {
		return items.findIndex(i => i.x == x && i.y == y);
	}

	function getSelected() {
		return items[i];
	}

	function getPos() {
		let current = items[i];
		if (!current || !current.dataset) return;
		let { x, y } = current.dataset;
		return { x, y };
	}

	function setOnPageChange(fn) {
		onPageChange = fn;
	}


	return {
		nextPage, lastPage, left, right, up, down, getSelected, getItems, goto, init, getPages, setPages, getPos, getItem, setOnPageChange
	};
}


export default createMenu;
