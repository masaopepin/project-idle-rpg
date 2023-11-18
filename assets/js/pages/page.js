import { createGenericElement } from "../helpers/helpers_html.js";
/** 
 * Base class for "pages" generated in JavaScript.
 * All pages extend this class and implement enter, update and exit functions.
 */
export class Page {
    /**
     * @param {import("../main.js").Game_Instance} game The game instance.
     * @param {string} pageTitleId The unique id of the string to display in the top bar.
     */
    constructor(game, pageTitleId = "") {
        /** The game instance. */
        this.game = game;
        /** The unique id of the string to display in the top bar. */
        this.pageTitleId = pageTitleId;
        /** Title displayed in the top bar. */
        this.pageTitle = "";
        /** Main container for the page. */
        this.container = null;
        /** Abort controller is called on exit to remove any event listener that added {signal: this.abortController.signal}. */
        this.abortController = new AbortController();
    }
    
    /** Called when entering a new page. */
    enter() {
        this.abortController = new AbortController();
        this.container = createGenericElement(this.game.pages.gameRoot, {className: "container-fluid container-md px-1"});
    }
    
    /** Called when refreshing a page and every game tick on the current active page. */
    update() {}
    
    /** Called on the current active page when switching page. */
    exit () {
        if (this.container !== null) {
            this.container.remove();
            this.container = null;
        }
        this.abortController.abort();
    }

    /**
     * Create a section with a given title.
     * @param {HTMLElement} parent Parent to append the section.
     * @param {string} innerHTML InnerHTML to apply.
     * @returns The section root element.
     */
    createSectionTitle(parent, innerHTML) {
        const section = createGenericElement(parent, {className: "section"});
        createGenericElement(section, {tag: "h3", className: "bg-dark rounded-top py-2 text-center", innerHTML: innerHTML});
        return section;
    }
}