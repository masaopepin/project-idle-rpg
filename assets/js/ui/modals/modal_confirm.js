import { createGenericButton, createGenericElement } from "../../helpers/helpers_html.js";
import { Modal_Generic } from "./modal_generic.js";

/** Class for the confirm modal.  */
export class Modal_Confirm extends Modal_Generic {
    /** @param {HTMLElement} parent The parent to append the modal. */
    constructor(parent) {
        super(parent, "modal-confirm", "modal-lg");
        this.confirmMessage = createGenericElement(this.modalBody, {className: "col p-2"});
        this.cancelButton = createGenericButton(this.modalFooter, {className: "col btn btn-danger", attributes: {"data-bs-dismiss": "modal"}});
        this.confirmButton = createGenericButton(this.modalFooter, {className: "col btn btn-success", attributes: {"data-bs-dismiss": "modal"}});
    }

    /**
     * Update the confirm modal with the given confirm message and onclick function.
     * @param {import("../../main.js").Game_Instance} game The game instance.
     * @param {string} confirmId The unique id of the confirm string.
     * @param {Function} onclick The function to assign to the confirm button.
     */
    update(game, confirmId, onclick) {
        this.modalTitle.innerHTML = game.languages.getString("confirmation");
        this.confirmMessage.innerHTML = game.languages.getString(confirmId);
        this.cancelButton.innerHTML = game.languages.getString("cancel");
        this.confirmButton.innerHTML = game.languages.getString("confirm");
        this.confirmButton.onclick = onclick;
    }
}