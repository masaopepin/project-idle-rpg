import { createGenericElement } from "../helpers/helpers_html.js";

/** Create a basic progressbar. */
export class Progressbar {
    /**
     * @param {HTMLElement} parent The parent to append the progressbar.
     * @param {string} name The string to set the aria-label attribute.
     */
    constructor(parent, name) {
        /** The root element of the bar. */
        this.root = createGenericElement(parent, {className: "col-12 my-2"});
        /** The bar background. */
        this.bar = createGenericElement(this.root, {className: "progress", attributes: {"role": "progressbar", "aria-label": name, "aria-valuemin": "0"}});
        /** The bar filling. */
        this.fill = createGenericElement(this.bar, {className: "progress-bar"});
    }

    /**
     * Update the aria-value now/max and the width of the fill.
     * @param {number} valueNow The new aria-valuenow.
     * @param {number} valueMax The new aria-valuemax.
     * @param {string} width The new width % of the fill.
     */
    update(valueNow, valueMax, width) {
        this.bar.ariaValueNow = valueNow.toString();
        this.bar.ariaValueMax = valueMax.toString();
        this.fill.style.width = width;
    }
}