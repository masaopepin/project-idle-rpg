import { createGenericElement } from "../../helpers/helpers_html.js";
import { Icon_Label } from "../labels/icon_label.js";

/**
 * @param {?HTMLElement} parent Parent to append the HTMLElement.
 * @param {number} maxDelay The max time in milliseconds before hiding the toast. The timer is resetted when updating an active toast.
 */
export class Toast_Reward {
    constructor(parent, maxDelay) {
        /** The item associated with the toast. */
        this.item = null;
        /** The skill associated with the toast. */
        this.skill = null;
        this.maxDelay = maxDelay;
        this.xpString = "";
        this.amount = 0;
        this.timer = 0;

        /** The toast root element. */
        this.root = createGenericElement(parent, {className: "d-flex"});
        this.toast = createGenericElement(this.root, {className: "toast toast-reward border-success", attributes: {"role": "status", "aria-live": "polite", "aria-atomic": "true"}});
        this.toastBody = createGenericElement(this.toast, {className: "toast-body p-1"});

        /** The icon label element to display item or skill reward. */
        this.iconLabel = new Icon_Label(this.toastBody, {
            size: "25px",
            updateFunction: () => { return this.getDisplayAmount(); }
        });
        this.bootstrapToast = bootstrap.Toast.getOrCreateInstance(this.toast, {autohide: false});
        this.toast.addEventListener("hide.bs.toast", () => { this.reset(); });
    }

    /** Show the toast. */
    show() {
        this.bootstrapToast.show();
    }

    /** Hide the toast. */
    hide() {
        this.bootstrapToast.hide();
    }

    /** Reset the variables to starting values. */
    reset() {
        this.item = null;
        this.skill = null;
        this.amount = 0;
        this.timer = 0;
    }

    /**
     * Update the toast with a given reward.
     * @param {?import("../../items/item.js").Item} item The item to associate with the toast.
     * @param {?import("../../skills/skill.js").Skill} skill The skill to associate with the toast. 
     * @param {number} amount The amount to add to the toast.
     */
    update(item, skill, amount) {
        if ((this.item !== null && this.item !== item) || (this.skill !== null && this.skill !== skill)) {
            this.reset();
        }
        this.item = item;
        this.skill = skill;
        if (item === null && skill === null) {
            this.hide();
            return;
        }
        this.setAmount(amount);
        
        const icon = item === null ? skill.icon : item.icon;
        this.iconLabel.icon.setAttribute("src", icon);
        this.iconLabel.update();
        this.showIfInactive();
    }

    /** Reset the timer of the toast and show the toast if not already shown. */
    showIfInactive() {
        if (this.bootstrapToast.isShown() === false) {
            this.show();
        }
        this.timer = 0;
    }

    /**
     * Set the amount and classList that will be displayed.
     * @param {number} amount The new amount.
     */
    setAmount(amount) {
        if (amount > 0) {
            if (this.amount < 0) {
                this.amount = 0;
            }
            this.toast.classList.replace("border-danger", "border-success");
        }
        else {
            if (this.amount > 0) {
                this.amount = 0;
            }
            this.toast.classList.replace("border-success", "border-danger");
        }

        this.amount += amount;
    }

    /**
     * The icon label update function.
     * @returns {string} The string to update the label.
     */
    getDisplayAmount() {
        let displayAmount = this.amount > 0 ? "+" + this.amount : "" + this.amount;

        if (this.skill !== null) {
            displayAmount += " " + this.xpString;
        }
        return displayAmount;
    }
}