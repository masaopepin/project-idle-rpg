import { createGenericElement, createGenericLink } from "../../helpers/helpers_html.js";
import { Icon_Label } from "../labels/icon_label.js";

/** Create a new navigation button with the given parent, icon, innerHTML, and onclick function. */
export class Nav_Button {
    /**
     * @param {?HTMLElement} parent Parent to append the nav button.
     * @param {string} iconClass IconClass to apply.
     * @param {string} stringId The unique id of the string to apply.
     * @param {Function} onclick A function to assign to the button onclick.
     */
    constructor(parent, iconClass, stringId, onclick) {
        const list = createGenericElement(parent, {tag: "li", className: "nav-item"});
        const link = createGenericLink(list, {
            className: "nav-link sidebar-link",
            attributes: {"role": "button", "data-bs-dismiss": "offcanvas", "data-bs-target": "#sidebarNav"}
        }, {
            onclick: (e) => { onclick(e); }
        });

        this.stringId = stringId;
        this.iconLabel = new Icon_Label(link, {source: iconClass});
        this.iconLabel.label.classList.add("fs-6");
    }
}