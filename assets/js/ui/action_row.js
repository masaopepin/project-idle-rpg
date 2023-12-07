import { createGenericElement, createGenericButton } from "../helpers/helpers_html.js";
import { Progressbar } from "./progressbar.js";

/** Create a row to display an active action with a label, a progressbar and a stop button. */
export class Action_Row {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance. 
     * @param {HTMLElement} parent The parent to append the row.
     * @param {?import("../actions/action.js").Action} action The action to create the row. 
     */
    constructor(game, parent, action) {
        this.action = null;

        this.row = createGenericElement(parent, {className: "row align-items-center fs-6"});
        this.actionName = createGenericElement(this.row, {className: "col-12 col-sm-auto p-0 text-center"});
        this.actionString = createGenericElement(this.row, {className: "col-12 col-sm-auto text-center"});
        this.rewardsRoot = createGenericElement(this.row, {className: "col-auto d-sm-flex p-0"});
        /** @type {Set.<import("./labels/icon_label.js").Icon_Label>} */
        this.totalLabels = new Set();

        this.stopButton = createGenericButton(this.row, {className: "col-auto ms-auto btn btn-danger", innerHTML: game.languages.getString("stop")}, {onclick: () => { this.action.stop(); }});
        this.actionProgress = new Progressbar(this.row, "action name");
        this.actionProgress.root.classList.add("px-0");
        this.setAction(game, action);
    }

    /** Update the action string, the total labels and the progressbar. */
    update() {
        if (this.action !== null) {
            this.actionString.innerHTML = this.action.getString();
            this.totalLabels.forEach((totalLabel) => { totalLabel.update(); });
            this.updateProgress();
        }
    }

    /** Update the action progressbar. */
    updateProgress() {
        if (this.action !== null) {
            this.actionProgress.update(this.action.elapsedTime, this.action.duration, this.action.elapsedPercent);
        }
    }

    /**
     * Set the action associated with the row.
     * @param {?import("../actions/action.js").Action} action The action to associate to the row. 
     */
    setAction(game, action) {
        if (action !== null) {
            this.action = action;
            const actionName = game.languages.getString(action.id);
            this.actionName.innerHTML = actionName;
            this.actionProgress.bar.setAttribute("aria-label", actionName);
            this.totalLabels = action.rewards.createTotalLabels(this.rewardsRoot);
            this.update();
        }
    }
}