# Bamazon - Node.js & MySQL Command Line Application
*UCF Coding Bootcamp Week 12 Homework*

## Synopsis

This is a fictitious online store inventory database that allows users to select a product and 'buy' a quantity of that item. The MySQL database get's updated when the user chooses to buy products. This app utilizes Node.js, MySQL and [Inquirer](https://www.npmjs.com/package/inquirer/).


## Code example

Upon running the program, the user will be shown all of the inventory in the database, and will be asked to give the ID of the product they would like to purchase:

![run app](images/inventory.gif)

Once the user provides the product ID, they are asked how many units of the product they would like to buy. Once they enter the amount, if the number that they entered is less than or equal to the current inventory number for the selected product, then the inputted number is subtracted from the product's available quantity and the product's new quantity is updated in the MySQL database. The user is shown a message stating that the products have been bought along with the total cost of their transaction. They are then asked whether they would like to shop again.

If the user types in a quantity that is larger than the current available quantity for the product that they have chosen, then an error message pops up, and they are taken back to the starting prompt.

![updated in the database](images/buying.gif)

## Manager View (under construction)

Part II of this assignment requires the developer to create a new Node application called bamazonManager.js. This application will allow the manager to (1) view products for Sale, (2) view low inventory, (3) add to the inventory, and (4) add new product. This portion is still a work-in-progress and is about 50% complete. The user can select and view products for sale. The user can also view item with low inventory. the application allows the user to select the item to add to the inventory. However, there is an uncorrected bug that indicates a length property is undefined in the add inventory function.

![managers view](images/parttwo.gif)
