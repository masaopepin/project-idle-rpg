import { Page } from "./page.js";
import { toPercent } from "../helpers/format_string.js";
import { createGenericElement } from "../helpers/helpers_html.js";
import { Action_Row } from "../ui/action_row.js";

/**
 * Page for the summary.
 * @extends {Page}
 */
export class Page_Summary extends Page {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        super(game, "summary");
        /** @type {Set.<Action_Row>} */
        this.actionRows = new Set();
        /** @type {Object.<string, HTMLElement>} */
        this.multipliersValue = {};
        this.stopString = "";
    }

    enter() {
        super.enter();
        this.stopString = this.game.languages.getString("stop");
        this.actionsRoot = this.createSectionTitle(this.container, this.game.languages.getString("actionsInProgress"));
        for (const action of this.game.actions.activeActions) {
            this.actionRows.add(new Action_Row(this.game, this.actionsRoot, action, this.stopString));
        }

        const multipliersRoot = this.createSectionTitle(this.container, this.game.languages.getString("multipliers"));
        //const multipliersRow = createGenericElement(multipliersRoot, {className: "row"});
        const table = createGenericElement(multipliersRoot, {tag: "table", className: "table table-dark table-striped table-hover mb-2"});
        const multipliersRow = createGenericElement(table, {tag: "tbody"});
        for (const [id, value] of this.game.multipliers.getMultipliers()) {
            //const div = createGenericElement(multipliersRow, {className: "col-12 col-md-6 mb-1 gx-2"});
            const div = createGenericElement(multipliersRow, {tag: "tr"});
            //const bg = createGenericElement(div, {className: "row bg-dark"});
            //const bg = createGenericElement(div, {tag: "td"});
            createGenericElement(div, {tag: "td", className: "fs-6", innerHTML: this.game.languages.getString(id)});
            this.multipliersValue[id] = createGenericElement(div, {tag: "td", className: "text-end fs-6", innerHTML: toPercent(value, 1)});
        }

        document.addEventListener("multipliersApplied", (e) => { this.multipliersApplied(e); }, {signal: this.abortController.signal});
        document.addEventListener("actionStarted", (e) => { this.actionStarted(e); }, {signal: this.abortController.signal});
        document.addEventListener("actionEnded", (e) => { this.actionEnded(e); }, {signal: this.abortController.signal});
        document.addEventListener("actionStopped", (e) => { this.actionStopped(e); }, {signal: this.abortController.signal});
    }

    multipliersApplied(e) {
        for (const [id, value] of this.game.multipliers.getMultipliers()) {
            const element = this.multipliersValue[id];
            if (element !== undefined) {
                element.innerHTML = toPercent(value, 1);
            }
        }
    }

    actionStarted(e) {
        /** @type {import("../events/manager_event.js").actionStarted} */
        const eventData = e.eventData;

        this.actionRows.add(new Action_Row(game, this.actionsRoot, eventData.action, this.stopString));
    }

    actionEnded(e) {
        /** @type {import("../events/manager_event.js").actionEnded} */
        const eventData = e.eventData;

        for (const actionRow of this.actionRows) {
            if (actionRow.action === eventData.action) {
                actionRow.update();
                return;
            }
        }
    }

    actionStopped(e) {
        /** @type {import("../events/manager_event.js").actionStopped} */
        const eventData = e.eventData;

        for (const actionRow of this.actionRows) {
            if (actionRow.action === eventData.action) {
                actionRow.row.remove();
                this.actionRows.delete(actionRow);
                return;
            }
        }
    }

    update() {
        for (const actionRow of this.actionRows) {
            actionRow.updateProgress();
        }
    }

    exit() {
        super.exit();
        this.actionRows.clear();
        this.actionsRoot = null;
        this.multipliersValue = {};
    }
}