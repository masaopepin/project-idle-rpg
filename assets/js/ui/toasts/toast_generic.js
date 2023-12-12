import { createGenericElement } from "../../helpers/helpers_html.js";

/**
 * @typedef ToastData
 * @prop {boolean} isAlert Boolean to change the role and aria-live attributes of the toast. Defaults to true.
 * @prop {string} delay Number of milliseconds before hiding the toast as a string. Defaults to "3000".
 */

/** Base class for toasts to notify the player about something. */
export class Toast_Generic {
    /**
     * @param {HTMLElement} parent The HTMLElement to append the toast.
     * @param {ToastData} toastData An object containing info about the toast.
     */
    constructor(parent, toastData = {}) {
        this.root = createGenericElement(parent, {className: "d-flex"});
        let attributes = toastData.isAlert === undefined || toastData.isAlert === true ? {"role": "alert", "aria-live": "assertive"} : {"role": "status", "aria-live": "polite"};
        attributes["aria-atomic"] = "true";
        attributes["data-bs-delay"] = toastData.delay === undefined ? "3000" : toastData.delay;
        this.toast = this.toast = createGenericElement(this.root, {className: "toast", attributes: attributes});
        this.toastBody = createGenericElement(this.toast, {className: "toast-body p-1"});
        this.bootstrapToast = bootstrap.Toast.getOrCreateInstance(this.toast);
    }

    /** Show the toast. */
    show() {
        this.bootstrapToast.show();
    }

    /** Hide the toast. */
    hide() {
        this.bootstrapToast.hide();
    }
}