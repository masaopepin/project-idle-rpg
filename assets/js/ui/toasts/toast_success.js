import { createGenericElement } from "../../helpers/helpers_html.js";
import { Toast_Generic } from "./toast_generic.js";

/**
 * Toast to notify the player about the success of something.
 * @extends {Toast_Generic}
 */
export class Toast_Success extends Toast_Generic {
    /**
     * @param {HTMLElement} parent The HTMLElement to append the toast.
     * @param {string} message The success string to display.
     */
    constructor(parent, message = "") {
        super(parent);
        this.toast.classList.add("text-bg-success");
        const root = createGenericElement(this.toastBody, {className: "d-flex align-items-center"});
        createGenericElement(root, {tag: "i", className: "bi bi-check-circle fs-4"});
        createGenericElement(root, {className: "ms-2 fs-6", innerHTML: message});
    }

    show() {
        super.show();
    }

    hide() {
        super.hide();
    }
}