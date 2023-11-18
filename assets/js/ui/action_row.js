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
        const actionName = game.languages.getString(action.id);
        const actionString = action.getString();

        this.row = createGenericElement(parent, {className: "d-flex flex-column flex-sm-row align-items-center section bg-dark p-1 m-1"});
        this.actionName = createGenericElement(this.row, {className: "col-sm-2", innerHTML: actionName});

        const div = createGenericElement(this.row, {className: "col-12 col-sm px-2"});
        this.actionString = createGenericElement(div, {className: "col", innerHTML: actionString});

        //const actionProgressDiv = createGenericElement(div, {className: "col mx-2"});
        this.actionProgress = new Progressbar(div, actionName + " " + actionString);
        //const actionButtonDiv = createGenericElement(this.row, {className: "col-sm-2"});
        this.stopButton = createGenericButton(this.row, {className: "col-sm-2 btn btn-danger", innerHTML: stopString}, {onclick: () => { action.stop(); }});


        /*this.row = createGenericElement(parent, {className: "row section bg-dark p-1 m-1"});
        this.actionName = createGenericElement(this.row, {className: "col-12 col-sm-2 my-auto", innerHTML: actionName});
        this.actionString = createGenericElement(this.row, {className: "col-12 col-sm-2 my-auto", innerHTML: actionString});

        const actionProgressDiv = createGenericElement(this.row, {className: "col-12 col-sm-6 m-auto"});
        this.actionProgress = new Progressbar(actionProgressDiv, actionName + " " + actionString);
        const actionButtonDiv = createGenericElement(this.row, {className: "col-auto p-1"});
        this.stopButton = createGenericButton(actionButtonDiv, {className: "btn btn-danger", innerHTML: stopString}, {onclick: () => { action.stop(); }});*/
    }
}