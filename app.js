const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");

// Sets connection with MySQL
const connection = mysql.createConnection({

    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_trackerDB"

})

// Start the connection, initiate beginning prompt
connection.connect((err) => {
    if (err) throw err;
    beginningPrompt();
  });

// First set of selections
beginningPrompt = () => {

    inquirer.prompt([

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

    // Switch cases for above selections
    ]).then((val) => {
        switch (val.selections) {
            case "View all Employees":
              viewAllEmployees();
            break;
    
          case "View all Employees by Role":
              viewAllRoles();
            break;
          
           case "View all Employees by Department":
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

// Function to view all employees
viewAllEmployees = () => {

    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.department_name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;", 
    (err, val) => {
      if (err) throw err
      console.table(val);
      beginningPrompt();
  });

};

// Function to view all employees by role
viewAllRoles = () => {

    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;", 
    (err, val) => {
    if (err) throw err
    console.table(val);
    beginningPrompt();
    });

};

// Function to view all employees by department
viewAllDepartments = () => {
 
    connection.query("SELECT employee.first_name, employee.last_name, department.department_name, department.id AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", 
    (err, val) => {
    if (err) throw err
    console.table(val);
    beginningPrompt();
    });

};

// Function to select a department
let deptArray = [];
selectDepartment = () => {
  connection.query("SELECT id, department_name FROM department", (err, val) => {
    if (err) throw err
    for (let i = 0; i < val.length; i++) {
      deptArray.push(val[i].department_name);
      
    };

  });
  return deptArray;
};

// Function to select a role
let rolesArray = [];
selectRole = () => {
  connection.query("SELECT * FROM role", (err, val) => {
    if (err) throw err

    for (let i = 0; i < val.length; i++) {

      rolesArray.push(val[i].title);
    };

  });
  return rolesArray;
};

// Function to select a manager
let managersArray = [];
selectManager = () => {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, val) {
    if (err) throw err
    for (let i = 0; i < val.length; i++) {
      managersArray.push(val[i].first_name);
    };

  });
  return managersArray;
};

// Function to add a new employee
addEmployee = () => {

    inquirer.prompt([

        {
            name: "first_name",
            type: "input",
            message: "Enter the Employee's first name"

        },
        {
            name: "last_name",
            type: "input",
            message: "Enter the Employee's last name"

        },
        {

            name: "role",
            type: "list",
            message: "What is the employee's role?",
            choices: selectRole()

        },
        {
            name: "selection",
            type: "rawlist",
            message: "What is the employee's manager's name?",
            choices: selectManager()

        }

        // Insert new values into table, +1 in both role and manager arrays
    ]).then((val) => {

        let roleID = selectRole().indexOf(val.role) + 1;
        let managerID = selectManager().indexOf(val.selection) + 1;

        connection.query("INSERT INTO employee SET ?",
        {

            first_name: val.first_name,
            last_name: val.last_name,
            manager_id: managerID,
            role_id: roleID



        }, (err) => {
            if (err) throw err
            console.table(val);
            beginningPrompt();
            
        });

    });

};

// Function to update an employee
updateEmployee = () => {

  connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", (err, val) => {

    if (err) throw err;

     inquirer.prompt ([

      {

        name: "last_name",
        type: "rawlist",
        choices: () => {

          let lastName = [];

          for(let i = 0; i < val.length; i++){

            lastName.push(val[i].last_name);

          }

          return lastName;

        },

        message:"Select the employee's last name",

      },

      {

        name: "role",
        type: "rawlist",
        message: "Select the employee's new role",
        choices: selectRole()


      },

      // Push new values into table, +1 in role array, insert roleID into role_id
    ]).then((val) => {
      
      let roleID = selectRole().indexOf(val.role) + 1;
    

      connection.query(`UPDATE employee SET role_id = ${roleID} WHERE ?`, 
      {

        last_name: val.last_name,

      },
      
      (err) => {

        if (err) throw err
        console.table(val)
        beginningPrompt()

      })
    })
  })
};

// Function to add a role
addRole = () => {

     inquirer.prompt([

      {

        name:"title",
        type: "input",
        message: "What is the title of this role?"

      },
      {

        name: "salary",
        type: "number",
        message: "What is the salary for this role?"        

      },
      {

        name:"department_id",
        type: "rawlist",
        message:"Which department will this role be under?",
        choices: selectDepartment()

      },

      // Push new values, +1 in the department array
    ]).then((val) => {

      let deptID = selectDepartment().indexOf(val.department_id) + 1
      connection.query("INSERT INTO role SET ?",
      
      {

        title: val.title,
        salary: val.salary,
        department_id: deptID

      },
      (err) => {

        if(err) throw err;
        console.table(val);
        beginningPrompt();

      })
    })
  };


// Function to add a department
addDepartment = () => {

  inquirer.prompt([

  {

    name: "department",
    type: "input",
    message: "What is the department you'd like to add?"

  }    

  ]).then((val) => {

    let query = connection.query("INSERT INTO department SET ?",
    
    {

      department_name: val.department

    },
    (err) => {

      if (err) throw err
      console.table(val);
      beginningPrompt(); 

    }
    
    )})
};