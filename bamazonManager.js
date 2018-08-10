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
  //displayInventory();
  startPrompt();
});



// inquirer prompts
var startupPrompt = {
    type: 'list',
    message: "What System Manager function would you like to complete?",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory","Add New Product"],
    name: 'start_prompt_response'
  };

var productaddPrompt = {
  type:'input',
  message:"Type in the ID of the product where you would like to add additional inventory:",
  name:'product_choice'
};
var productQuantityPrompt = {
  type:'input',
  message:"How many units of the product would you like to add?",
  name:'product_quantity'
};
var restartPrompt = {
  type: "list",
  message: "Would you like to quit?",
  choices: ["Yes", "No"],
  name: "restart_prompt"
};
// take the input from the startupPrompt and switch to the chosen case
var startPrompt = function(res){
    inquirer.prompt([startupPrompt]).then(function(inquirerResponse){
        //if (inquirerResponse.start_prompt_response === "View Products for Sale") {
            //viewProductsforSale()
           // console.log("Viewing Products for Sale Menu");
         // } 
       // if (inquirerResponse.start_prompt_response === "View Low Inventory") {
            //viewlowInventory()
          //  console.log("Viewing Low Inventory Menu");
        //  }
       // if (inquirerResponse.start_prompt_response === "Add to Inventory") {
            //addtoInventory()
          //  console.log("Viewing Add to Inventory Menu");
        //  }
        //if (inquirerResponse.start_prompt_response === "Add New Product") {
            //addnewProduct()
           // console.log("Viewing Add New Product Menu");
         // } 
          
        //switch action
        var action = inquirerResponse.start_prompt_response;
        switch (action) {
            case "View Products for Sale":
                console.log("Viewing all Products for Sale");
                displayallInventory();
                break;

            case "View Low Inventory":
                console.log("LOW INVENTORY MENU"+ "\n" + "----------------------------");
                displaylowInventory();
                break;

            case "Add to Inventory":
                console.log("ADD INVENTORY MENU"+ "\n" + "----------------------------");
                addInventory();
                break;

            case "Add New Product":
                console.log("Add New Product");
                break;
        };
    });
};

// displays all inventory when called by the user
var displayallInventory = function(){
  connection.query("SELECT * FROM products", function(err,res){
    console.log("DISPLAYING ALL INVENTORY:" + "\n" + "----------------------------");
    for (var i = 0; i < res.length; i++) {
      console.log("Item ID: " + res[i].item_id + "\n" + "Product Name: " + res[i].product_name + "\n" + "Price: $" + res[i].price + "\n" + "Available Quantity: " + res[i].stock_quantity + "\n----------------------------");
    };
    quitAction();
  });
};

// displays low inventory when called by the user
var displaylowInventory = function(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 6", function(err,res){
      console.log("LOW INVENTORY:" + "\n" + "----------------------------");
      for (var i = 0; i < res.length; i++) {
        console.log("Item ID: " + res[i].item_id + "\n" + "Product Name: " + res[i].product_name + "\n" + "Price: $" + res[i].price + "\n" + "Available Quantity: " + res[i].stock_quantity + "\n----------------------------");
      };
      quitAction()
    });
  };

// function adds inventory based on the users input
var addInventory = function(){
//displays all the inventory to assist user with selection
    connection.query("SELECT * FROM products", function(err,res){
      console.log("DISPLAYING ALL INVENTORY:" + "\n" + "----------------------------");
      for (var i = 0; i < res.length; i++) {
        console.log("Item ID: " + res[i].item_id + "\n" + "Product Name: " + res[i].product_name + "\n" + "Price: $" + res[i].price + "\n" + "Available Quantity: " + res[i].stock_quantity + "\n----------------------------");
      };    
    promptCustomer();
  });
};

// ask user if they want to restart the process
var quitAction = function(){
    inquirer.prompt([restartPrompt]).then(function(inquirerResponse){
        if (inquirerResponse.restart_prompt === "No") {
            startPrompt();
        } else {
          console.log("Thank You!");
          connection.end();
        };
      });
};

var promptCustomer = function(res){
  inquirer.prompt([productaddPrompt]).then(function(inquirerResponse){
    // turn user answer into integer and store as variable
    var chosenProductID = parseInt(inquirerResponse.product_choice);
    // display information about the chosen product
    connection.query("SELECT * FROM products WHERE item_id = $" + chosenProductID, function(err,res){
        console.log("DISPLAYING ALL INVENTORY:" + "\n" + "----------------------------");
        for (var i = 0; i < res.length; i++) {
          console.log("Item ID: " + res[i].item_id + "\n" + "Product Name: " + res[i].product_name + "\n" + "Price: $" + res[i].price + "\n" + "Available Quantity: " + res[i].stock_quantity + "\n----------------------------");
        };
    });
    for (var i=0;i<res.length;i++){
      if(res[i].item_id === chosenProductID){
        // stores the i number of this loop into a variable so that it can be called in the next inquirer prompt
        var id = i;
        // prompt how many they would like to add
        inquirer.prompt([productQuantityPrompt]).then(function(inquirerResponse){
          // turn user answer into integer and store as variable
          var chosenQuantity = parseInt(inquirerResponse.product_quantity);

          // if that number is less than or equal to the current inventory number for that product
          if ((res[id].stock_quantity - chosenQuantity) >= 0) {
            // subtract the inputted number from the product's stock_quantity and set as variable
            var newQuantity = res[id].stock_quantity + chosenQuantity;
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
              quitAction();
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