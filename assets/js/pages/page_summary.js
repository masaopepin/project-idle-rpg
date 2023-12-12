import { Page } from "./page.js";
import { toPercent } from "../helpers/format_string.js";
import { createGenericElement, createUpgradeButton } from "../helpers/helpers_html.js";
import { Action_Row } from "../ui/action_row.js";
import { Modal_Upgrade } from "../ui/modals/modal_upgrade.js";

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
        this.multipliers = {};
        this.stopString = "";
        this.modalUpgrade = null;
    }

    enter() {
        super.enter();
        this.stopString = this.game.languages.getString("stop");
        this.modalUpgrade = new Modal_Upgrade(this.game, this.game.pages.modalRoot);

        this.actionsRoot = this.createSectionTitle(this.container);

        // Top row
        const topRow = this.createSectionTopRow(this.actionsRoot);
        createGenericElement(topRow, {className: "col-auto p-0", innerHTML: this.game.languages.getString("actionsInProgress")});
        const actionUpgradeDiv = createGenericElement(topRow, {className: "col-auto d-flex align-items-center p-0"});
        this.activeActions = createGenericElement(actionUpgradeDiv, {className: "mx-3 fs-3", innerHTML: "(" + this.game.actions.activeActions.size + " / " + this.game.actions.maxActions + ")"});
        createUpgradeButton(actionUpgradeDiv, this.modalUpgrade, this.game.upgrades.getUpgrade("multitasking"));

        // Action table
        const actionTable = createGenericElement(this.actionsRoot, {tag: "table", className: "table table-striped table-hover m-0"});
        this.actionTableBody = createGenericElement(actionTable, {tag: "tbody"});
        for (const action of this.game.actions.activeActions) {
            this.addActionRow(this.actionTableBody, action);
        }

        // Multipliers table
        const multipliersRoot = this.createSectionTitle(this.container, this.game.languages.getString("multipliers"));
        const table = createGenericElement(multipliersRoot, {tag: "table", className: "table table-sm table-striped table-hover mb-0 fs-6"});
        const multipliersRow = createGenericElement(table, {tag: "tbody"});
        for (const [id, value] of this.game.multipliers.getMultipliers()) {
            const div = createGenericElement(multipliersRow, {tag: "tr"});
            createGenericElement(div, {tag: "td", className: "align-middle ps-2", innerHTML: this.game.languages.getString(id)});
            this.multipliers[id] = createGenericElement(div, {tag: "td", className: "align-middle text-end", innerHTML: toPercent(value, 1)});
            const modalTd = createGenericElement(div, {tag: "td", className: "align-middle text-end"});
            createUpgradeButton(modalTd, this.modalUpgrade, this.game.upgrades.getUpgrade(id));
        }

        document.addEventListener("multipliersApplied", (e) => { this.multipliersApplied(e); }, {signal: this.abortController.signal});
        document.addEventListener("upgradeApplied", (e) => { this.upgradeApplied(e); }, {signal: this.abortController.signal});
        document.addEventListener("actionStarted", (e) => { this.actionStarted(e); }, {signal: this.abortController.signal});
        document.addEventListener("actionEnded", (e) => { this.actionEnded(e); }, {signal: this.abortController.signal});
        document.addEventListener("actionStopped", (e) => { this.actionStopped(e); }, {signal: this.abortController.signal});
    }

    multipliersApplied(e) {
        for (const [id, element] of Object.entries(this.multipliers)) {
            element.innerHTML = toPercent(this.game.multipliers.getMultiplier(id), 1);
        }
    }

    upgradeApplied(e) {
        /** @type {import("../events/manager_event.js").upgradeApplied} */
        const eventData = e.eventData;
        if (eventData.upgrade.id === "multitasking") {
            this.activeActions.innerHTML = this.game.actions.maxActionsString;
            return;
        }
        for (const [id, element] of Object.entries(this.multipliers)) {
            if (id === eventData.upgrade.id) {
                element.innerHTML = toPercent(this.game.multipliers.getMultiplier(id), 1);
                return;
            }
        }
    }

    actionStarted(e) {
        /** @type {import("../events/manager_event.js").actionStarted} */
        const eventData = e.eventData;

        this.activeActions.innerHTML = this.game.actions.maxActionsString;
        this.addActionRow(this.actionTableBody, eventData.action);
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

        this.activeActions.innerHTML = "(" + this.game.actions.activeActions.size + " / " + this.game.actions.maxActions + ")";
        this.removeActionRow(eventData.action);
    }

    update() {
        for (const actionRow of this.actionRows) {
            actionRow.updateProgress();
        }
    }

    exit() {
        super.exit();
        if (this.modalUpgrade !== null) {
            this.modalUpgrade.modal.remove();
            this.modalUpgrade = null;
        }
        this.actionRows.clear();
        this.actionsRoot = null;
        this.multipliers = {};
    }

    /**
     * Add a new action row to the action table.
     * @param {HTMLElement} parent The parent to append the action row.
     * @param {import("../actions/action.js").Action} action The action to associate with the row.
     */
    addActionRow(parent, action) {
        const tr = createGenericElement(parent, {tag: "tr"});
        const td = createGenericElement(tr, {tag: "td"});
        this.actionRows.add(new Action_Row(this.game, td, action));
    }

    /**
     * Remove an action row from the action table.
     * @param {import("../actions/action.js").Action} action The action associated with the row.
     */
    removeActionRow(action) {
        for (const actionRow of this.actionRows) {
            if (actionRow.action === action) {
                actionRow.row.parentElement.parentElement.remove();
                this.actionRows.delete(actionRow);
                return;
            }
        }
    }
}