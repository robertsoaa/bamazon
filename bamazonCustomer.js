var mysql = require('mysql');
var inquirer = require('inquirer');

// connect to the mysql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});

//tests connection
connection.connect(function(err){
  if(err){
    console.log(err);
    return;
  }
  console.log("connected as id " + connection.threadId);
  displayInventory();
});

// inquirer prompts
var productPurchasePrompt = {
  type:'input',
  message:"Type in the ID of the product you would like to purchase:",
  name:'product_purchase'
};
var productQuantityPrompt = {
  type:'input',
  message:"How many units of the product would you like to purchase?",
  name:'product_quantity'
};
var restartPrompt = {
  type: "list",
  message: "Would you like to shop again?",
  choices: ["Yes", "No"],
  name: "restart_prompt"
};

// displays all inventory when first running application
var displayInventory = function(){
  connection.query("SELECT * FROM products", function(err,res){
    console.log("DISPLAYING ALL INVENTORY:" + "\n" + "----------------------------");
    for (var i = 0; i < res.length; i++) {
      console.log("Item ID: " + res[i].item_id + "\n" + "Product Name: " + res[i].product_name + "\n" + "Price: $" + res[i].price + "\n" + "Available Quantity: " + res[i].stock_quantity + "\n----------------------------");
    }
    // then prompts users with which products they would like to buy
    promptCustomer(res);
  })
}

var promptCustomer = function(res){
  inquirer.prompt([productPurchasePrompt]).then(function(inquirerResponse){
    // turn user answer into integer and store as variable
    var chosenProductID = parseInt(inquirerResponse.product_purchase);
    for (var i=0;i<res.length;i++){
      if(res[i].item_id === chosenProductID){
        // stores the i number of this loop into a variable so that it can be called in the next inquirer prompt
        var id = i;
        // prompt how many they would like to buy
        inquirer.prompt([productQuantityPrompt]).then(function(inquirerResponse){
          // turn user answer into integer and store as variable
          var chosenQuantity = parseInt(inquirerResponse.product_quantity);

          // if that number is less than or equal to the current inventory number for that product
          if ((res[id].stock_quantity - chosenQuantity) >= 0) {
            // subtract the inputted number from the product's stock_quantity and set as variable
            var newQuantity = res[id].stock_quantity - chosenQuantity;
            //total cost
            var totalCost = res[id].price * chosenQuantity;
            // update value in database with newQuantity
            var sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
            var values = ['products', 'stock_quantity', newQuantity, 'item_id', chosenProductID];
            connection.query(sql, values, function(err, res){
              if(err){
                console.log(err);
                connection.end();
              }
              // alert the user the total cost of the transaction (price * inputted quantity) and that they have bought the product
              console.log("Product(s) bought!" + "\n" + "Total Cost of Transaction: $" + totalCost);
              // ask user if they want to restart the process
              inquirer.prompt([restartPrompt]).then(function(inquirerResponse){
                if (inquirerResponse.restart_prompt === "Yes") {
                  displayInventory();
                } else {
                  console.log("Thank You!");
                  connection.end();
                }
              })
            })
          }
          // if the number is greater than the product's stock_quantity amount, alert the user & restart the promptCustomer function
          else {
            console.log("Insufficient Quantity! Please enter a number less than or equal to the selected item's available quantity.");
            promptCustomer(res);
          }
        })
      }
    }
  })
}