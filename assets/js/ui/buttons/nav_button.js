import { createGenericElement, createGenericLink } from "../../helpers/helpers_html.js";
import { Icon_Label } from "../labels/icon_label.js";

/**
 * @typedef NavButtonData
 * @prop {string} [source] Optional source of the icon.
 * @prop {string} [iconClass] Optional bootstrap icon class to use instead of the source.
 * @prop {string} [href] Optional href to assign to the link.
 * @prop {Function} [onclick] Optional function to assign to the link onclick. Defaults to switching page using the stringId.
 */

/** Create a new navigation button for the sidebar. */
export class Nav_Button {
    /**
     * @param {import("../../main.js").Game_Instance} game The game instance.
     * @param {?HTMLElement} parent Parent to append the button.
     * @param {string} stringId The unique id of the string to assign to the button.
     * @param {NavButtonData} buttonData An object containing info about the button.
     */
    constructor(game, parent, stringId, buttonData = {}) {
        this.stringId = stringId;
        const list = createGenericElement(parent, {tag: "li", className: "nav-item"});
        const link = createGenericLink(list, {
            className: "nav-link sidebar-link",
            attributes: buttonData.href === undefined ? {"role": "button", "data-bs-dismiss": "offcanvas", "data-bs-target": "#sidebarNav"} : {"role": "button"}
        }, {
            href: buttonData.href,
            onclick: buttonData.onclick === undefined ? () => { game.pages.switchPage(this.stringId); } : buttonData.onclick
        });

        this.iconLabel = new Icon_Label(link, {source: buttonData.source, iconClass: buttonData.iconClass});
    }

    /**
     * Update the nav button text using the stringId.
     * @param {import("../../main.js").Game_Instance} game The game instance. 
     */
    update(game) {
        this.iconLabel.label.innerHTML = game.languages.getString(this.stringId);
    }
}