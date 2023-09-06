/**
 * Get the parent location of a URL
 *
 * @param {String} url - The URL to pass
 * @returns {String} - The parent of the passed URL
 */
export default function getParentLocation(url) {
	return url.split("/").slice(0, -1).join("/");
}
