import { createGenericElement, createGenericButton } from "../helpers/helpers_html.js";
import { Progressbar } from "./progressbar.js";

/** Create a row to display an active action with a label, a progressbar and a stop button. */
export class Action_Row {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance. 
     * @param {HTMLElement} parent The parent to append the row.
     * @param {import("../actions/action.js").Action} action The action to create the row. 
     * @param {string} stopString The stop string from the current language.
     */
    constructor(game, parent, action, stopString) {
        this.action = action;
        const actionName = action === game.errors.action ? "name" : game.languages.getString(action.id);
        const actionString = action.getString();

        this.row = createGenericElement(parent, {className: "row section border-0 bg-dark p-1 m-1"});
        const div = createGenericElement(this.row, {className: "row col-12 col-sm p-0"});

        this.actionName = createGenericElement(div, {className: "col-auto fs-6 my-auto", innerHTML: actionName});
        this.actionString = createGenericElement(div, {className: "col-auto fs-6 my-auto", innerHTML: actionString});
        this.rewardsRoot = createGenericElement(div, {className: "col-sm d-flex"});
        this.totalLabels = this.action.rewards.createTotalLabels(this.rewardsRoot);

        this.actionProgress = new Progressbar(div, actionName);
        this.stopButton = createGenericButton(this.row, {className: "col-sm-2 btn btn-danger mt-auto mb-2", innerHTML: stopString}, {onclick: () => { this.action.stop(); }});
    }

    /** Update the action string and progress. */
    update() {
        this.actionString.innerHTML = this.action.getString();
        this.totalLabels.forEach((totalLabel) => { totalLabel.update(); });
        this.updateProgress();
    }

    /** Update the action progressbar. */
    updateProgress() {
        this.actionProgress.update(this.action.elapsedTime, this.action.duration, this.action.elapsedPercent);
    }

    /**
     * Set the action associated with the row.
     * @param {import("../actions/action.js").Action} action The action to associate to the row. 
     */
    setAction(game, action) {
        this.action = action;
        const actionName = game.languages.getString(this.action.id);;
        this.actionName.innerHTML = actionName;
        this.actionProgress.bar.setAttribute("aria-label", actionName);
        this.totalLabels = this.action.rewards.createTotalLabels(this.rewardsRoot);
        this.update();
    }
}