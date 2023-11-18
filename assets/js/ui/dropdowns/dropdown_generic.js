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
        this.root = createGenericElement(parent, {className: dropdownData.className === undefined ? "dropdown" : "dropdown " + dropdownData.className});
        /** The dropdown toggle element. */
        this.toggle = createGenericButton(this.root, {
            className: "btn btn-dark dropdown-toggle w-100",
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
     * Set the active item of the dropdown.
     * @param {string} itemName The name of the new active item.
     */
    setActiveItemFromName(itemName) {
        for (const item of this.items) {
            if (item.innerHTML === itemName) {
                this.setActiveItem(item);
                break;
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