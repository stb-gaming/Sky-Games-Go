function strftime(format) {
	const date = this;

	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const months = [
		'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
	];

	return format.replace(/%([a-zA-Z])/g, function (_, fmtCode) {
		switch (fmtCode) {
			case 'Y': return date.getFullYear(); // Full year (4 digits)
			case 'y': return date.getFullYear() % 100; // Short year (2 digits)
			case 'm': return ('0' + (date.getMonth() + 1)).slice(-2); // Month (zero-padded)
			case 'd': return ('0' + date.getDate()).slice(-2); // Day of the month (zero-padded)
			case 'H': return ('0' + date.getHours()).slice(-2); // Hour (24-hour format, zero-padded)
			case 'M': return ('0' + date.getMinutes()).slice(-2); // Minute (zero-padded)
			case 'S': return ('0' + date.getSeconds()).slice(-2); // Second (zero-padded)
			case 'A': return days[date.getDay()]; // Full day name
			case 'a': return days[date.getDay()].slice(0, 3); // Abbreviated day name
			case 'B': return months[date.getMonth()]; // Full month name
			case 'b': return months[date.getMonth()].slice(0, 3); // Abbreviated month name
			case 'l': {
				const hour12 = date.getHours() % 12 || 12;
				return hour12.toString(); // Hour in 12-hour format without leading zeros
			}
			case 'P': {
				const meridian = date.getHours() >= 12 ? 'PM' : 'AM';
				return meridian.toLowerCase(); // "AM" or "PM" in lowercase
			}
			default: return '%' + fmtCode; // Any other character, return the original format code
		}
	});
};


export default strftime;
