# Project Idle RPG
#### Video Demo:  <URL HERE>
#### Description:
My final project for the CS50x course is an idle game made with JavaScript, HTML and CSS. I started working on this project on October 1, 2023 and been working on it for around 5 days a week since then. It is the cumulative work of over 400 hours of coding. I used JSDoc syntax to comment and to help IntelliSense provide me with appropriate auto-complete suggestions while writing the code. All the icons in the [assets/icons](assets/icons/) folder were made by me using GIMP 2.10.34 software. The game can be played entirely locally using the Live Server extension of VS Code or with other similar ways of starting a local server.

The main game loop is simple:
<details><summary>Gather</summary>

***Use one of the gathering skills (Fishing, Mining or Woodcutting) to collect resources that can be sold, used in crafting recipes or used to purchase upgrades.***
- To start gathering, select one of the gathering skills from the navigation bar, then click on the gathering node button you want to start.
- Each node can have conditions that must be met before being able to gather from the node. These conditions will appear below the node button when they fail.
- All gathering actions automatically stop when reaching the inventory size limit.
</details>
<details><summary>Craft</summary>

***Use one of the crafting skills (Cooking, Smithing, Carpentering) to turn resources into products that can be sold or used to purchase upgrades.***
- To start crafting, select one of the crafting skills from the navigation bar, then click on a crafting recipe button to open the crafting modal. Choose the number of time to repeat the recipe, then click the action button.
- Each recipe can have conditions that must be met before being able to craft the recipe. These conditions will appear on the recipe button instead of the recipe name when they fail.
- You can stop the crafting action at any time to get a refund of the unused ingredients. This refund can go over the inventory size limit to make sure you don't lose items in the process.
- All crafting actions automatically stop when reaching the inventory size limit, refunding the unused ingredients.
</details>
<details><summary>Sell</summary>

***Earn money that can be used to purchase upgrades.***
- To sell, select the inventory from the navigation bar, then click on an item to open the inventory modal. Choose the amount to sell, then click the sell button.
</details>
<details><summary>Upgrade</summary>

***Use your hard-earned money, resources and products to purchase upgrades that will enhance your character.***
- To upgrade, click on an upgrade button (green button with a "+" sign) or select the shop from the navigation bar, then click on a buy button to open the shop modal. Choose the amount to purchase, then click the buy button.
- Each upgrade can have conditions that must be met before being able to buy the upgrade. These conditions will appear above the buy button when they fail.
- After purchasing an item, select the inventory from the navigation bar, then click on the item to open the inventory modal. From there you can equip or sell the item if it can be equipped or sold by clicking the corresponding button.
</details>

---
#### Files:

Here is an overview of what each file in the project does. For more detailed information about each functions, feel free to look at the comments in the respective files.

[index.html](index.html): This is the HTML file where everything happen. It only contains the basic structure of the page, and everything else is generated using JavaScript.

[styles.css](assets/css/styles.css): Most of the CSS comes from Bootstrap, and the custom ones are in this file.

[main.js](assets/js/main.js): The main module of the game. This script imports all other needed modules and starts the main game loop.

<details><summary>Actions</summary>

- [action.js](assets/js/actions/action.js): Base class for actions that have a duration.
  - [action_crafting.js](assets/js/actions/action_crafting.js): Action started when crafting a [recipe](assets/js/skills/crafting_recipe.js). The player must have enough currency for the [costs](assets/js/misc/cost.js) and meet the [conditions](assets/js/misc/condition.js).
  - [action_gathering.js](assets/js/actions/action_gathering.js): Action started when gathering a [node](assets/js/skills/gathering_node.js). The player must meet the [conditions](assets/js/misc/condition.js).
- [manager_action.js](assets/js/actions/manager_action.js): Creates and updates the active [actions](assets/js/actions/action.js).

</details>

<details><summary>Events</summary>

- [manager_error.js](assets/js/events/manager_error.js): Creates classes used for initializing certain variables.
- [manager_event.js](assets/js/events/manager_event.js): Creates the game events and dispatches them when needed.

</details>

<details><summary>Helpers</summary>

- [format_string.js](assets/js/helpers/format_string.js): Contains helpers functions to convert to strings.
- [helpers_html.js](assets/js/helpers/helpers_html.js): Contains helpers functions to create HTML elements.

</details>

<details><summary>Items</summary>

- [item.js](assets/js/items/item.js): Class constructed from an item data that represents an item in the game.
- [manager_item.js](assets/js/items/manager_item.js): Creates the database of all [items](assets/js/items/item.js) from the item data in the categories below.
  - [currencies.js](assets/js/items/currencies.js): Contains the item data for the currencies category.
  - [foods.js](assets/js/items/foods.js): Contains the item data for the foods category.
  - [materials.js](assets/js/items/materials.js): Contains the item data for the materials category.
  - [resources.js](assets/js/items/resources.js): Contains the item data for the resources category.
  - [tools.js](assets/js/items/tools.js): Contains the item data for the tools category.
- [manager_inventory.js](assets/js/items/manager_inventory.js): Creates the player's inventory and manages adding and removing [items](assets/js/items/item.js).
- [manager_equipment.js](assets/js/items/manager_equipment.js): Creates the player's equipment and manages equipping and unequipping [items](assets/js/items/item.js).

</details>

<details><summary>Languages</summary>

- [manager_language.js](assets/js/languages/manager_language.js): Loads the translated strings for the language set in the [settings](assets/js/save/settings.js) or defaults to [English](assets/js/languages/language_en.js) if the setting is invalid.
  - [language_en.js](assets/js/languages/language_en.js): Contains the translated strings in English.
  - [language_fr.js](assets/js/languages/language_fr.js): Contains the translated strings in French.

</details>

<details><summary>Misc</summary>

- [condition.js](assets/js/misc/condition.js) Class for conditions that must be met before doing something.
- [cost.js](assets/js/misc/cost.js) Class for costs required to buy or craft something.
- [reward.js](assets/js/misc/reward.js) Class for rewards that can be given to the player.
- [multipliers.js](assets/js/misc/multipliers.js) Class for multipliers that affect the player performance.

</details>

<details><summary>Pages</summary>

- [page.js](assets/js/pages/page.js): Base class for HTML pages generated in JavaScript.
  - [page_summary.js](assets/js/pages/page_summary.js): Default page of the game. Displays the active [actions](assets/js/actions/action.js) and current value of the [multipliers](assets/js/misc/multipliers.js).
  - [page_inventory.js](assets/js/pages/page_inventory.js): Page to interact with the player's [inventory](assets/js/items/manager_inventory.js) and [equipment](assets/js/items/manager_equipment.js). The inventory can be filtered by category, type and names.
  - [page_settings.js](assets/js/pages/page_settings.js): Page with inputs to change the game [settings](assets/js/save/settings.js).
  - [page_shop.js](assets/js/pages/page_shop.js): Page to purchase [items](assets/js/items/item.js).
  - [page_skill.js](assets/js/pages/page_skill.js): Page to interact with a [skill](assets/js/skills/skill.js). Shows the current level, xp and list of [actions](assets/js/actions/action.js).
- [manager_page.js](assets/js/pages/manager_page.js): Creates and updates the [pages](assets/js/pages/page.js).

</details>

<details><summary>Save</summary>

- [save_game.js](assets/js/save/save_game.js): Contains functions to save and load the game in the localStorage.
- [player.js](assets/js/save/player.js): Saves and loads the player data.
- [settings.js](assets/js/save/settings.js): Saves and loads the settings data.

</details>

<details><summary>Shops</summary>

- [shop.js](assets/js/shops/shop.js): Class constructed from a shop data that represents a shop in the game.
  - [shop_tools.js](assets/js/shops/shop_tools.js): Contains the shop data for the [tools](assets/js/items/tools.js).
- [manager_shop.js](assets/js/shops/manager_shop.js): Creates and holds the [shops](assets/js/shops/shop.js).

</details>

<details><summary>Skills</summary>

- [skill.js](assets/js/skills/skill.js): Base class for skills.
  - [fishing.js](assets/js/skills/fishing.js): Gathering skill to collect raw fishes.
  - [mining.js](assets/js/skills/mining.js): Gathering skill to collect ores.
  - [woodcutting.js](assets/js/skills/woodcutting.js): Gathering skill to collect logs.
  - [cooking.js](assets/js/skills/cooking.js): Crafting skill to turn raw fishes into cooked fishes.
  - [smithing.js](assets/js/skills/smithing.js): Crafting skill to turn ores into ingots.
  - [carpentering.js](assets/js/skills/carpentering.js): Crafting skill to turn logs into planks.
- [manager_skill.js](assets/js/skills/manager_skill.js): Creates and manages the [skills](assets/js/skills/skill.js).
- [gathering_node.js](assets/js/skills/gathering_node.js): Class used by [skills](assets/js/skills/skill.js) to start a [gathering action](assets/js/actions/action_gathering.js).
- [crafting_recipe.js](assets/js/skills/crafting_recipe.js): Class used by [skills](assets/js/skills/skill.js) to start a [crafting action](assets/js/actions/action_crafting.js).

</details>

<details><summary>UI</summary>

- Buttons
  - [nav_button.js](assets/js/ui/buttons/nav_button.js): Creates a button for the navigation bar that links to a [page](assets/js/pages/page.js) when clicked.
- Dropdowns
  - [dropdown_generic.js](assets/js/ui/dropdowns/dropdown_generic.js): Creates a generic dropdown menu with functions to update the content.
- Inputs
  - [input_range_number.js](assets/js/ui/inputs/input_range_number.js): Creates an input of type range and an input of type number that share the same value.
- Labels
  - [icon_label.js](assets/js/ui/labels/icon_label.js): Creates an icon with a text on the right that can be updated.
- [modal_generic.js](assets/js/ui/modals/modal_generic.js): Base class for modals with a header, body and footer.
  - [modal_confirm.js](assets/js/ui/modals/modal_confirm.js): Modal used to prompt the player with a confirmation message before doing something important.
  - [modal_crafting.js](assets/js/ui/modals/modal_crafting.js): Modal used by [skills](assets/js/skills/skill.js) to start a [crafting action](assets/js/actions/action_crafting.js).
  - [modal_equipment.js](assets/js/ui/modals/modal_equipment.js): Modal used by the [inventory page](assets/js/pages/page_inventory.js) to unequip [items](assets/js/items/item.js).
  - [modal_inventory.js](assets/js/ui/modals/modal_inventory.js): Modal used by the [inventory page](assets/js/pages/page_inventory.js) to equip and sell [items](assets/js/items/item.js).
  - [modal_shop.js](assets/js/ui/modals/modal_shop.js): Modal used by the [shop page](assets/js/pages/page_shop.js) to buy [items](assets/js/items/item.js).
  - [modal_upgrade.js](assets/js/ui/modals/modal_upgrade.js): Modal used to buy [upgrades](assets/js/upgrades/upgrade.js).
- [toast_generic.js](assets/js/ui/toasts/toast_generic.js): Base class for toasts used to notify the player about something.
  - [toast_failure.js](assets/js/ui/toasts/toast_failure.js) Creates a toast to notify the player about the failure of something.
  - [toast_success.js](assets/js/ui/toasts/toast_success.js) Creates a toast to notify the player about the success of something.
- [action_row.js](assets/js/ui/action_row.js): Creates a row to display the progress of an [action](assets/js/actions/action.js).
- [item_icon.js](assets/js/ui/item_icon.js): Creates an icon to display an [inventory](assets/js/items/manager_inventory.js) slot or an [equipment](assets/js/items/manager_equipment.js) slot.
- [progressbar.js](assets/js/ui/progressbar.js): Creates a basic progressbar with an update function.

</details>

<details><summary>Upgrades</summary>

- [upgrade.js](assets/js/upgrades/upgrade.js): Contains the base class for upgrades and all classes that extends it. They apply different effects based on the current level of the upgrade, which can be bought for a certain [cost](assets/js/misc/cost.js).
- [manager_upgrade.js](assets/js/upgrades/manager_upgrade.js): Creates and manages the [upgrades](assets/js/upgrades/upgrade.js).

</details>

---
#### Conclusion:
I had a lot of fun creating this project and I may continue to work on it in the future to see how far I can take it. I would like to thank all the staff who made this course possible, and highly recommend it to anyone interested in learning programming.
