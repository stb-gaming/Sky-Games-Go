let packs = {
	1998: 0, 2005: 0, 2008: 0, 2009: 0
};
//Convert real year to pretend year
export const realToPretend = year => {
	let start = 1998,
		end = 2011,
		length = end - start;

	return (year - start) % length + start;
};

//get song pack from pretend year
export const yearToPack = year => {
	let packNames = Object.keys(packs);
	for (let i in packNames) {
		if (
			Number(i) + 1 === packNames.length
			|| year < Number(packNames[Number(i) + 1])
		) return Number(packNames[i]);
	}
};

///pick a radnom song in the pack
