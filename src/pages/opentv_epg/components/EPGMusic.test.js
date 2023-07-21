

import { realToPretend, yearToPack } from "./EPGMusic";

describe("Get the EPG music for the year", () => {
	it("Converts real to pretend years", () => {
		expect(realToPretend(1999)).toBe(1999);
		expect(realToPretend(2008)).toBe(2008);
		expect(realToPretend(2023)).toBe(2010);
		expect(realToPretend(2024)).toBe(1998);
		expect(realToPretend(2025)).toBe(1999);
		expect(realToPretend(2026)).toBe(2000);
		expect(realToPretend(2034)).toBe(2008);
		expect(realToPretend(2036)).toBe(2010);
	});
	it("Gets pack from year", () => {
		expect(yearToPack(1998)).toBe(1998);
		expect(yearToPack(2000)).toBe(1998);
		expect(yearToPack(2006)).toBe(2005);
		expect(yearToPack(2008)).toBe(2008);
		expect(yearToPack(2010)).toBe(2009);
	});
});
