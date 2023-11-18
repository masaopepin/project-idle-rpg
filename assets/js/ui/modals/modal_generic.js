import { createGenericElement } from "../../helpers/helpers_html.js";

/** Base class for modals. */
export class Modal_Generic {
    /**
     * @param {HTMLElement} parent The parent to append the modal.
     * @param {string} id The unique id of the modal.
     * @param {string} size The size class of the modal.
     */
    constructor(parent, id, size) {
        /** The root element of the modal. */
        this.modal = createGenericElement(parent, {className: "modal fade", attributes: {"id": id, "tabIndex": "-1", "aria-hidden": "true"}});
        this.modalDialog = createGenericElement(this.modal, {className: "modal-dialog modal-dialog-centered modal-dialog-scrollable " + size});
        this.modalContent = createGenericElement(this.modalDialog, {className: "modal-content bg-dark"});

        this.modalHeader = createGenericElement(this.modalContent, {className: "modal-header"});
        this.modalTitle = createGenericElement(this.modalHeader, {tag: "h1", className: "modal-title fs-5"});
        this.modalCloseButton = createGenericElement(this.modalHeader, {tag: "button", className: "btn-close", attributes: {"data-bs-dismiss": "modal", "aria-label": "Close"}});

        this.modalBody = createGenericElement(this.modalContent, {className: "modal-body p-1"});
        this.modalFooter = createGenericElement(this.modalContent, {className: "modal-footer p-1"});
    }
}