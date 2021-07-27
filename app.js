const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");


const connection = mysql.createConnection({

    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_trackerDB"

})

connection.connect((err) => {
    if (err) throw err;
    beginningPrompt();
  });

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


viewAllEmployees = () => {

    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.department_name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;", 
    (err, val) => {
      if (err) throw err
      console.table(val);
      beginningPrompt();
  });

};

viewAllRoles = () => {

    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;", 
    (err, val) => {
    if (err) throw err
    console.table(val);
    beginningPrompt();
    });

};

viewAllDepartments = () => {
 
    connection.query("SELECT employee.first_name, employee.last_name, department.department_name, department.id AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", 
    (err, val) => {
    if (err) throw err
    console.table(val);
    beginningPrompt();
    });

};

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