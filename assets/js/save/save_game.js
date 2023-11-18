/**
 * Save a key value pair in the localStorage.
 * @param {string} key The key to save.
 * @param {string} value The value to associate to the key.
 */
export function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    console.log(key + " saved to localStorage.");
}

/**
 * Try to load data from a given key in the localStorage.
 * @param {string} key The key of the data to load.
 * @returns The object if the data was loaded or null.
 */
export function load(key) {
    const data = localStorage.getItem(key);
    if (data === null) {
        console.log("Couldn't load " + key + " from localStorage.");
        return null;
    }
    const obj = JSON.parse(data);
    if (obj === undefined || obj === null) {
        console.log("Couldn't load " + key + " from localStorage.");
        return null;
    }
    console.log("Finished loading " + key + " from localStorage.");
    return obj;
}