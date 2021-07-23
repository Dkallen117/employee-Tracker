const inquier = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");


const connection = mysql.createConnection({

    host: "localhost",
    port: 3301,
    user: "root",
    password: "password",
    database: "employee_trackerDB"

})

connection.connect((err) => {
    if (err) throw err;
    beginningPrompt();
  });

  beginningPrompt = () => {

    inquier.prompt([

    {
        type: "list",
        message:"Select what you'd like to do",
        name:"selections",
        choices:[

            "View all Employees",
            "View all Employees by Role",
            "View all Employees by Department",
            "Update an Employee",
            "Add an Employee",
            "Add Role",
            "Add Department"

        ] 

    }

    ]).then((val) => {
        switch (val.selections) {
            case "View all Employees":
              viewAllEmployees();
            break;
    
          case "View all Employees by Role":
              viewAllRoles();
            break;
          case "View all Employees by Deparment":
              viewAllDepartments();
            break;
          
          case "Add an Employee":
                addEmployee();
              break;

          case "Update an Employee":
                updateEmployee();
              break;
      
            case "Add Role":
                addRole();
              break;
      
            case "Add Department":
                addDepartment();
              break;
    
            };
    });
};