import { timeToString } from "../../helpers/format_string.js";
import { createGenericElement, createGenericImage } from "../../helpers/helpers_html.js";

/**
 * @typedef IconLabelData
 * @prop {Function} [updateFunction] Optional function to be called when updating the label.
 * @prop {string} [source] Optional source of the the icon.
 * @prop {string} [size] Optional size of the icon. Defaults to "32px".
 * @prop {string} [iconClass] Optional bootstrap icon class to use instead of source.
 * @prop {string} [iconFontSize] Optional font size of the bootstrap icon. Defaults to "2rem".
 * @prop {string} [innerHTML] Optional innerHTML of the label. Used when the label doesn't have an update function.
 * @prop {string} [tooltip] Optional tooltip to display when hovering the icon.
 */

/** Create an icon with a label to the right */
export class Icon_Label {
    /**
     * @param {?HTMLElement} parent Parent to append the icon label.
     * @param {IconLabelData} [labelData] Optional object containing info about the label.
     */
    constructor(parent, labelData = {}) {
        /** Function to be called when updating the label. */
        this.updateFunction = () => { return ""; };

        /** The root element of the icon */
        this.root = createGenericElement(parent, {className: "d-flex align-items-center"});

        let icon = null;
        if (labelData.iconClass !== undefined) {
            const iconFontSize = labelData.iconFontSize === undefined ? "2rem" : labelData.iconFontSize;
            icon = createGenericElement(this.root, {className: labelData.iconClass, styles: {"font-size": iconFontSize}});
        }
        else {
            const source = labelData.source === undefined ? "" : labelData.source
            const size = labelData.size === undefined ? "32px" : labelData.size;
            icon = createGenericImage(this.root, {attributes: {"src": source}, styles: {"width": size}});
        }
        /** The icon element. */
        this.icon = icon;
        if (labelData.tooltip !== undefined) {
            this.icon.setAttribute("data-bs-toggle", "tooltip");
            this.icon.setAttribute("data-bs-title", labelData.tooltip);
            bootstrap.Tooltip.getOrCreateInstance(this.icon);
        }

        /** The label element to the right */
        this.label = createGenericElement(this.root, {className: "mx-2 fs-6"});
        if (labelData.updateFunction !== undefined) {
            this.updateFunction = labelData.updateFunction;
            this.label.innerHTML = this.updateFunction().toString();
        }
        else {
            this.label.innerHTML = labelData.innerHTML === undefined ? "" : labelData.innerHTML;
        }
    }

    /** Update the label using the updateFunction return value. */
    update() {
        this.label.innerHTML = this.updateFunction().toString();
    }
}

/**
 * Create an icon label to display the inventory size.
 * @extends {Icon_Label}
 */
export class Inventory_Label extends Icon_Label {
    /**
     * @param {import("../../main.js").Game_Instance} game The game instance.
     * @param {?HTMLElement} parent Parent to append the icon label.
     */
    constructor(game, parent) {
        /** @type {IconLabelData} */
        const labelData = {
            source: "assets/icons/misc/inventory.png",
            tooltip: game.languages.getString("inventory"),
            updateFunction: () => { return game.inventory.size + " / " + game.inventory.maxSize; }
        };
        super(parent, labelData);
        this.game = game;
        this.update();
    }

    update() {
        if (this.game.inventory.isFull) {
            this.label.classList.add("text-danger");
        }
        else {
            this.label.classList.remove("text-danger");
        }
        super.update();
    }
}

/**
 * @typedef DurationLabelData
 * @prop {number} [baseDuration] Optional base duration of the label.
 * @prop {Function} [durationMultiplier] Optional number to multiply the base duration. Default to 1.
 * @prop {import("../../skills/skill.js").Skill} [skill] Optional skill associated with the label.
 */

/**
 * Create an icon label to display a duration time.
 * @extends {Icon_Label}
 */
export class Duration_Label extends Icon_Label {
    /**
     * @param {import("../../main.js").Game_Instance} game The game instance.
     * @param {HTMLElement} parent The parent to append the duration label.
     * @param {DurationLabelData} durationData An object containing info about the label.
     */
    constructor(game, parent, durationData) {
        const labelData = {
            source: "assets/icons/misc/duration.png",
            tooltip: game.languages.getString("actionDuration"),
        };
        super(parent, labelData);
        /** The duration of the label without multipliers applied. */
        this.baseDuration = durationData.baseDuration === undefined ? 0 : durationData.baseDuration;
        /** The number to multiply the base duration. */
        this.durationMultiplier = durationData.durationMultiplier === undefined ? 1 : durationData.durationMultiplier;
        /** The skill associated with the label. */
        this.skill = durationData.skill === undefined ? null : durationData.skill;

        if (this.skill !== null) {
            this.updateFunction = () => { return timeToString(this.baseDuration * this.durationMultiplier * this.skill.durationMultiplier); };
        }
        else {
            this.updateFunction = () => { return timeToString(this.baseDuration * this.durationMultiplier); };
        }
        this.update();
    }

    /**
     * Update the duration label and optionally the multiplier.
     * @param {number} [durationMultiplier] Optional number to multiply the base duration. Defaults to 1.
     */
    update(durationMultiplier) {
        if (durationMultiplier !== undefined) {
            this.durationMultiplier = durationMultiplier;
        }
        super.update();
    }
}