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


viewAllEmployees = () => {

    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;", 
    (err, res) => {
      if (err) throw err
      console.table(res);
      beginningPrompt();
  });

};

viewAllRoles = () => {

    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;", 
    (err, res) => {
    if (err) throw err
    console.table(res);
    beginningPrompt();
    });

};

viewAllDepartments = () => {

    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", 
    (err, res) => {
      if (err) throw err
      console.table(res);
      beginningPrompt();
    });

};

let rolesArray = [];
selectRole = () => {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err
    for (let i = 0; i < res.length; i++) {
      rolesArray.push(res[i].title);
    };

  });
  return rolesArray;
};

let managersArray = [];
selectManager = () => {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (let i = 0; i < res.length; i++) {
      managersArray.push(res[i].first_name);
    };

  });
  return managersArray;
};

addEmployee = () => {

    inquier.prompt([

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

    ]).then((val) => {

        let roleID = selectRole().indexOf(val.role) + 1;
        let managerID = selectManager().indexOf(val.selection) + 1;

        connection.query("INSERT INTO employee SET ?",
        {

            firstName: val.first_name,
            lastName: val.last_name,
            manager_id: managerID,
            role_id: roleID



        }, (err) => {
            if (err) throw err
            console.table(val);
            beginningPrompt();
            
        });

    });

};

updateEmployee = () => {

  connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", (err, res) => {

    if (err) throw err;

    inquier.prompt ([

      {

        name: "lastName",
        type: "rawlist",
        choices: () => {

          let lastName = [];

          for(i = 0; i < res.length; i++){

            lastName.push(res[i].last_name);

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
    ]).then((val) => {

      let roleID = selectRole().indexOf(val.role) + 1
      connection.query("UPDATE employee SET WHERE ?", 
      {

        last_name: val.lastName

      },
      {

        role_id: roleID

      },
      
      (err) => {

        if (err) throw err;
        console.table(val)
        beginningPrompt()

      })
    })
  })
};

addRole = () => {

  console.query("SELECT role.title AS Title, role.salary AS Salary FROM role", (err, res) => {

    inquier.prompt([

      {

        name:"Title",
        type: "input",
        message: "What is the title of this role?"

      },
      {

        name: "Salary",
        type: "input",
        message: "What is the salary for this role?"        

      }
    ]).then((res) => {

      connection.query("INSERT INTO role SET ?",
      
      {

        title: res.Title,
        salary: res.Salary,

      },
      (err) => {

        if(err) throw err;
        console.table(res);
        beginningPrompt();

      })
    })
  });
};

addDepartment = () => {

  inquier.prompt([

  {

    name: "department",
    type: "input",
    message: "What is the department you'd like to add?"

  }    

  ]).then((res) => {

    let query = connection.query("INSERT INTO department SET ?",
    
    {

      name: res.department

    },
    (err) => {

      if (err) throw err
      console.table(res);
     beginningPrompt(); 

    }
    
    )})
};