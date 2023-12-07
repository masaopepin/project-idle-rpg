import { createGenericButton, createGenericElement, removeChildren } from "../../helpers/helpers_html.js";

/**
 * @typedef DropdownData
 * @prop {string} [className] Optional className to apply to the root.
 * @prop {string} [innerHTML] Optional innerHTML to apply to the toggle.
 * @prop {string[]} [itemList] Optional list of dropdown items to create.
 * @prop {string} [activeItem] Optional current active item of the dropdown.
 * @prop {Function} [onclick] Optional function that will be called when clicking a dropdown item.
 * @prop {boolean} [showActiveOnToggle] Optional bool to show the active item on the toggle. Defaults to true.
 */

/** Create a generic dropdown menu. */
export class Dropdown_Generic {
    /**
     * @param {HTMLElement} parent The parent to append the dropdown.
     * @param {string} id The unique id of the dropdown.
     * @param {DropdownData} [dropdownData] Optional object containing info about the dropdown.
     */
    constructor(parent, id, dropdownData = {}) {
        /** The dropdown root element. */
        this.root = createGenericElement(parent, {className: dropdownData.className === undefined ? "dropdown-center" : "dropdown-center " + dropdownData.className});
        /** The dropdown toggle element. */
        this.toggle = createGenericButton(this.root, {
            className: "btn btn-body dropdown-toggle w-100",
            innerHTML: dropdownData.innerHTML === undefined ? "" : dropdownData.innerHTML,
            attributes: {"id": id, "data-bs-toggle": "dropdown", "aria-expanded": "false"}
        });
        /** Bool to show the active item on the toggle. Defaults to true. */
        this.showActiveOnToggle = dropdownData.showActiveOnToggle === undefined ? true : dropdownData.showActiveOnToggle;
        /** The dropdown menu element. */
        this.menu = createGenericElement(this.root, {tag: "ul", className: "dropdown-menu"});
        /**
         * The set of dropdown item elements.
         * @type {Set.<HTMLElement>}
         */
        this.items = new Set();
        /**
         * Object that associate string to string id.
         * @type {Object.<string, string>}
         */
        this.stringsId = {};
        /** The currently active dropdown item element. */
        this.activeItem = null;
        this.createItems(dropdownData);
    }

    /**
     * Create the dropdown items from a given dropdown data.
     * @param {DropdownData} dropdownData An object containing info about the dropdown.
     */
    createItems(dropdownData) {
        this.items.clear();
        this.activeItem = null;
        removeChildren(this.menu);

        if (dropdownData.itemList === undefined) {
            return;
        }
        dropdownData.itemList.forEach((itemName) => {
            let className = "dropdown-item";
            if (itemName === "") {
                className += " mt-1";
            }
            const item = createGenericButton(this.menu, {className: className, innerHTML: itemName}, {onclick: dropdownData.onclick});
            this.items.add(item);

            if (itemName === dropdownData.activeItem) {
                this.setActiveItem(item);
            }
        });
    }

    /**
     * Create the dropdown items from an array of string id and a given dropdown data.
     * @param {import("../../main.js").Game_Instance} game The game instance.
     * @param {string[]} stringsId The array of string id to create the dropdown items.
     * @param {DropdownData} dropdownData An object containing info about the dropdown.
     */
    createItemsFromStringsId(game, stringsId, dropdownData) {
        this.stringsId = {};
        stringsId.forEach((stringId) => {
            const translatedString = game.languages.getString(stringId);
            this.stringsId[translatedString] = stringId;
            if (dropdownData.activeItem === stringId) {
                dropdownData.activeItem = translatedString;
            }
        });
        dropdownData.itemList = Object.keys(this.stringsId);
        this.createItems(dropdownData);
    }

    /** @returns The unique id of the active item string or an empty string if not found. */
    getActiveItemId() {
        if (this.activeItem !== null) {
            const stringId = this.stringsId[this.activeItem.innerHTML];
            if (stringId !== undefined) {
                return stringId;
            }
        }
        return "";
    }

    /**
     * Get the string id of the given item if found.
     * @param {HTMLElement} item The item element to get the string id.
     * @returns The unique id of the item or an empty string if not found.
     */
    getItemStringId(item) {
        const stringId = this.stringsId[item.innerHTML];
        if (stringId !== undefined) {
            return stringId;
        }
        return "";
    }

    /**
     * Set the active item of the dropdown.
     * @param {string} itemName The name of the new active item.
     */
    setActiveItemFromName(itemName) {
        for (const item of this.items) {
            if (item.innerHTML === itemName) {
                this.setActiveItem(item);
                return;
            }
        }
    }

    /**
     * Set the active item of the dropdown.
     * @param {HTMLElement} item The item element to set active.
     */
    setActiveItem(item) {
        if (this.activeItem !== null) {
            this.activeItem.classList.remove("active");
            this.activeItem.removeAttribute("aria-current");
        }

        this.activeItem = item;
        item.classList.add("active");
        item.setAttribute("aria-current", "true");
        if (this.showActiveOnToggle === true) {
            this.toggle.innerHTML = item.innerHTML;
        }
    }
}