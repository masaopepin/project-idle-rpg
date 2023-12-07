import { Page } from "./page.js";
import { createGenericButton, createGenericElement, createGenericInput, createUpgradeButton, removeChildren } from "../helpers/helpers_html.js";
import { Equipment_Icon, Inventory_Icon } from "../ui/item_icon.js";
import { Inventory_Label } from "../ui/labels/icon_label.js";
import { Modal_Inventory } from "../ui/modals/modal_inventory.js";
import { Modal_Equipment } from "../ui/modals/modal_equipment.js";
import { Dropdown_Generic } from "../ui/dropdowns/dropdown_generic.js";
import { Modal_Upgrade } from "../ui/modals/modal_upgrade.js";

/**
 * Page for the player inventory.
 * @extends {Page}
 */
export class Page_Inventory extends Page {
    /** @param {import("../main.js").Game_Instance} game The game instance. */
    constructor(game) {
        super(game, "inventory");
        this.modalEquipment = null;
        this.modalInventory = null;
        this.modalUpgrade = null;

        this.equipmentRow = null;
        this.inventoryRow = null;

        this.inventoryLabel = null;
        this.datalistElement = null;
        this.categoryDropdown = null;
        this.typeDropdown = null;
        this.nameInput = null;
        this.categoryFilter = "";
        this.typeFilter = "";
        this.nameFilter = "";

        /** @type {Set.<Inventory_Icon>} */
        this.inventoryIcons = new Set();
        /** @type {Set.<Equipment_Icon>} */
        this.equipmentIcons = new Set();
    }

    enter() {
        super.enter();
        this.allString = this.game.languages.getString("all");
        this.categoryFilter = this.allString;
        this.typeFilter = this.allString;
        this.nameFilter = "";
        this.modalInventory = new Modal_Inventory(this.game, this.game.pages.modalRoot);
        this.modalEquipment = new Modal_Equipment(this.game, this.game.pages.modalRoot);
        this.modalUpgrade = new Modal_Upgrade(this.game, this.game.pages.modalRoot);

        const equipmentSection = this.createSectionTitle(this.container, this.game.languages.getString("equipments"));
        this.equipmentRow = createGenericElement(equipmentSection, {className: "row g-2 m-1"});

        const inventorySection = this.createSectionTitle(this.container);
        const filtersRow = this.createSectionTopRow(inventorySection);
        this.inventoryRow = createGenericElement(inventorySection, {className: "row g-2 m-1"});

        // Inventory size
        const inventorySize = createGenericElement(filtersRow, {className: "col-lg-auto d-flex justify-content-center my-1 my-lg-0"});
        this.inventoryLabel = new Inventory_Label(this.game, inventorySize);
        createUpgradeButton(inventorySize, this.modalUpgrade, this.game.upgrades.getUpgrade("inventorySize"));

        // Category filter
        const inputGroup = createGenericElement(filtersRow, {className: "col-sm d-flex flex-column flex-sm-row px-0"});
        this.categoryDropdown = new Dropdown_Generic(inputGroup, "filterItemCategory", {
            className: "d-flex col-12 col-sm-auto ms-lg-auto",
            activeItem: this.categoryFilter,
            itemList: Object.keys(this.game.items.categories),
            onclick: (e) => {
                this.categoryFilter = e.currentTarget.innerHTML;
                this.typeFilter = this.allString;
                this.categoryDropdown.setActiveItem(e.currentTarget);
                this.setTypeDropdown();
                this.filterInventory();
            }
        });

        // Type filter
        this.typeDropdown = new Dropdown_Generic(inputGroup, "filterItemType", {className: "d-flex col-12 col-sm-auto"});
        this.setTypeDropdown();

        // Name filter
        const nameInputGroup = createGenericElement(filtersRow, {className: "col input-group"});
        this.nameInput = createGenericInput(nameInputGroup, {
            className: "form-control",
            attributes: {
                "name": this.game.languages.getString("filterItemName"),
                "placeholder": this.game.languages.getString("placeholder_enterItemName"),
                "size": "30",
                "list": "itemNames"
            }
        }, {
            allowAutoComplete: true
        });
        this.datalistElement = document.getElementById("itemNames");
        this.nameInput.oninput = () => {
            this.nameFilter = this.nameInput.value;
            this.createItemNamesDatalist(this.datalistElement, this.nameFilter);
            this.filterInventory();
        };
        createGenericButton(nameInputGroup, {className: "btn btn-danger", innerHTML: "X"}, {onclick: () => { this.unfilterInventory(); }});

        // Item icons
        this.createEquipmentIcons();
        this.createInventoryIcons();

        document.addEventListener("itemAdded", (e) => { this.itemAdded(e); }, {signal: this.abortController.signal});
        document.addEventListener("itemRemoved", (e) => { this.itemRemoved(e); }, {signal: this.abortController.signal});
        document.addEventListener("itemEquipped", (e) => { this.itemEquipped(e); }, {signal: this.abortController.signal});
        document.addEventListener("itemUnequipped", (e) => { this.itemUnequipped(e); }, {signal: this.abortController.signal});
        document.addEventListener("upgradeApplied", (e) => { this.upgradeApplied(e); }, {signal: this.abortController.signal});
    }

    update() {

    }

    exit() {
        super.exit();
        if (this.modalEquipment !== null) {
            this.modalEquipment.modal.remove();
            this.modalEquipment = null;
        }
        if (this.modalInventory !== null) {
            this.modalInventory.modal.remove();
            this.modalInventory = null;
        }
        if (this.modalUpgrade !== null) {
            this.modalUpgrade.modal.remove();
            this.modalUpgrade = null;
        }

        this.equipmentRow = null;
        this.inventoryRow = null;

        this.inventoryLabel = null;
        if (this.datalistElement !== null) {
            removeChildren(this.datalistElement);
            this.datalistElement = null;
        }
        this.categoryDropdown = null;
        this.typeDropdown = null;
        this.nameInput = null;

        this.inventoryIcons.clear();
        this.equipmentIcons.clear();
    }

    itemAdded(e) {
        /** @type {import("../events/manager_event.js").itemAdded} */
        const eventData = e.eventData;

        if (eventData.wasCreated) {
            this.inventoryLabel.update();
            this.createInventoryIcon(eventData.slot);
            return;
        }

        for (const inventoryIcon of this.inventoryIcons) {
            if (inventoryIcon.slot === eventData.slot) {
                inventoryIcon.update();
                return;
            }
        }
    }

    itemRemoved(e) {
        /** @type {import("../events/manager_event.js").itemRemoved} */
        const eventData = e.eventData;

        for (const inventoryIcon of this.inventoryIcons) {
            if (inventoryIcon.slot === eventData.slot) {
                if (eventData.wasDeleted) {
                    this.inventoryLabel.update();
                    this.inventoryIcons.delete(inventoryIcon);
                    inventoryIcon.root.remove();
                }
                else {
                    inventoryIcon.update();
                }
                return;
            }
        }
    }

    itemEquipped(e) {
        /** @type {import("../events/manager_event.js").itemEquipped} */
        const eventData = e.eventData;
        this.updateEquipmentIcon(eventData.slot);
    }

    itemUnequipped(e) {
        /** @type {import("../events/manager_event.js").itemUnequipped} */
        const eventData = e.eventData;
        this.updateEquipmentIcon(eventData.slot);
    }

    upgradeApplied(e) {
        /** @type {import("../events/manager_event.js").upgradeApplied} */
        const eventData = e.eventData;

        if (eventData.upgrade.id === "inventorySize") {
            this.inventoryLabel.update();
        }
    }

    /**
     * Create a new row to display items.
     * @param {string} innerHTML The name of the row in the current language.
     * @returns The row element.
     */
    createRow(innerHTML) {
        const section = this.createSectionTitle(this.container, innerHTML);
        return createGenericElement(section, {className: "row g-3 m-3"});
    }

    /**
     * Create the datalist element containing item names suggestions for searching.
     */
    createItemNamesDatalist(parent, value) {
        if (parent === null) {
            return;
        }
        removeChildren(parent);
        if (value === "") {
            return;
        }
        const maxSuggestions = 5;
        let suggestionsCount = 0;
        value = value.toLowerCase();
        for (const item of Object.values(this.game.items.db)) {
            const lowerCaseName = item.name.toLowerCase();
            if (lowerCaseName.includes(value)) {
                createGenericElement(parent, {tag: "option", attributes: {"value": item.name}});
                suggestionsCount++;
                if (suggestionsCount >= maxSuggestions) {
                    break;
                }
            }
        }
    }

    /** Create the type filter dropdown items for the current language. */
    setTypeDropdown() {
        this.typeDropdown.createItems({
            activeItem: this.typeFilter,
            itemList: this.game.items.categories[this.categoryFilter],
            onclick: (e) => {
                this.typeFilter = e.currentTarget.innerHTML;
                this.typeDropdown.setActiveItem(e.currentTarget);
                this.filterInventory();
            }
        });
    }

    /** Show or hide all items in the inventory based on the current filters. */
    filterInventory() {
        this.inventoryIcons.forEach((icon) => { icon.filter(this.categoryFilter, this.typeFilter, this.nameFilter, this.allString); });
    }

    /** Reset all filters to default and show all items. */
    unfilterInventory() {
        for (const inventoryIcon of this.inventoryIcons) {
            inventoryIcon.root.classList.remove("d-none");
        }
        this.categoryFilter = this.allString;
        this.categoryDropdown.setActiveItemFromName(this.categoryFilter);
        this.typeFilter = this.allString;
        this.setTypeDropdown();
        this.nameFilter = "";
        this.nameInput.value = "";
    }

    /** Create the equipment icon for all equipment slots. */
    createEquipmentIcons() {
        for (const slot of this.game.equipments.equipments) {
            this.createEquipmentIcon(slot);
        }
    }

    /**
     * Create an equipment icon for the given equipment slot.
     * @param {import("../items/manager_equipment.js").EquipmentSlot} slot The equipment slot to create the icon.
     */
    createEquipmentIcon(slot) {
        this.equipmentIcons.add(new Equipment_Icon(this.game, this.equipmentRow, this.modalEquipment, slot));
    }

    /**
     * Update the equipment icon that corresponds to the given equipment slot.
     * @param {import("../items/manager_equipment.js").EquipmentSlot} slot The equipment slot to update.
     */
    updateEquipmentIcon(slot) {
        for (const icon of this.equipmentIcons) {
            if (icon.slot === slot) {
                icon.update();
            }
        }
    }

    /** Create the inventory icon for all inventory slots. */
    createInventoryIcons() {
        for (const slot of this.game.inventory.inventory) {
            this.createInventoryIcon(slot);
        }
    }

    /**
     * Create an inventory icon for the given item slot.
     * @param {import("../items/manager_inventory.js").InventorySlot} slot The slot of the item to create an icon.
     */
    createInventoryIcon(slot) {
        const icon = new Inventory_Icon(this.game, this.inventoryRow, this.modalInventory, slot);
        icon.filter(this.categoryFilter, this.typeFilter, this.nameFilter, this.allString);
        this.inventoryIcons.add(icon);
    }
}