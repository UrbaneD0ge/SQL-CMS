const { prompt } = require("inquirer");
const db = require("./db");
require("console.table");

init();

function init() {
  doTheThing();
}

function doTheThing() {
  prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES"
        },
        {
          name: "View All Employees By Department",
          value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
        },
        {
          name: "View All Employees By Manager",
          value: "VIEW_EMPLOYEES_BY_MANAGER"
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE"
        },
        {
          name: "Remove Employee",
          value: "REMOVE_EMPLOYEE"
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE"
        },
        {
          name: "Update Employee Manager",
          value: "UPDATE_EMPLOYEE_MANAGER"
        },
        {
          name: "View All Roles",
          value: "VIEW_ROLES"
        },
        {
          name: "Add Role",
          value: "ADD_ROLE"
        },
        {
          name: "Remove Role",
          value: "REMOVE_ROLE"
        },
        {
          name: "View All Departments",
          value: "VIEW_DEPARTMENTS"
        },
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT"
        },
        {
          name: "Remove Department",
          value: "REMOVE_DEPARTMENT"
        },
        {
          name: "View Total Utilized Budget By Department",
          value: "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT"
        },
        {
          name: "Quit",
          value: "QUIT"
        }
      ]
    }
  ]).then(res => {
    let choice = res.choice;
    switch (choice) {
      case "VIEW_EMPLOYEES":
        viewEmployees();
        break;
      case "VIEW_EMPLOYEES_BY_DEPARTMENT":
        viewEmployeesByDepartment();
        break;
      case "VIEW_EMPLOYEES_BY_MANAGER":
        viewEmployeesByManager();
        break;
      case "ADD_EMPLOYEE":
        addEmployee();
        break;
      case "REMOVE_EMPLOYEE":
        removeEmployee();
        break;
      case "UPDATE_EMPLOYEE_ROLE":
        updateEmployeeRole();
        break;
      case "UPDATE_EMPLOYEE_MANAGER":
        updateEmployeeManager();
        break;
      case "VIEW_DEPARTMENTS":
        viewDepartments();
        break;
      case "ADD_DEPARTMENT":
        addDepartment();
        break;
      case "REMOVE_DEPARTMENT":
        removeDepartment();
        break;
      case "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT":
        viewUtilizedBudgetByDepartment();
        break;
      case "VIEW_ROLES":
        viewRoles();
        break;
      case "ADD_ROLE":
        addRole();
        break;
      case "REMOVE_ROLE":
        removeRole();
        break;
      default:
        quit();
    }
  })
}

function viewEmployees() {
  db.findAllEmployees()
    .then(([employees]) => {
      console.log("\n");
      console.table(employees);
    })
    .then(() => doTheThing());
}

function viewEmployeesByDepartment() {
  db.findAllDepartments()
    .then(([departments]) => {
      const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
      }));

      prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Which department would you like to view?",
          choices: departmentChoices
        }
      ])
        .then(res => db.findAllEmployeesByDepartment(res.departmentId))
        .then(([employees]) => {
          console.log("\n");
          console.table(employees);
        })
        .then(() => doTheThing())
    });
}

function viewEmployeesByManager() {
  db.findAllEmployees()
    .then(([managers]) => {
      const managerChoices = managers.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));
      prompt([
        {
          type: "list",
          name: "managerId",
          message: "Which employee do you want to see direct reports for?",
          choices: managerChoices
        }
      ])
        .then(res => db.findAllEmployeesByManager(res.managerId))
        .then(([employees]) => {
          console.log("\n");
          if (employees.length === 0) {
            console.log("This employee is UNMANAGED!! [panic]");
          } else {
            console.table(employees);
          }
        })
        .then(() => doTheThing())
    });
}

function removeEmployee() {
  db.findAllEmployees()
    .then(([employees]) => {
      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));
      prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee do you want to remove?",
          choices: employeeChoices
        }
      ])
        .then(res => db.removeEmployee(res.employeeId))
        .then(() => console.log("FIRE'D."))
        .then(() => doTheThing())
  })
}

function updateEmployeeRole() {
  db.findAllEmployees()
    .then(([employees]) => {
      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));
      prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee's role do you want to update?",
          choices: employeeChoices
        }
      ])
        .then(res => {
          let employeeId = res.employeeId;
          db.findAllRoles()
            .then(([roles]) => {
              const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id
              }));
              prompt([
                {
                  type: "list",
                  name: "roleId",
                  message: "Which role do you want to assign the selected employee?",
                  choices: roleChoices
                }
              ])
                .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                .then(() => console.log("Promoted! Or Demoted!??"))
                .then(() => doTheThing())
            });
        });
  })
}

function updateEmployeeManager() {
  db.findAllEmployees()
    .then(([employees]) => {
      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));
      prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee's manager do you want to sack?",
          choices: employeeChoices
        }
      ])
        .then(res => {
          let employeeId = res.employeeId
          db.findAllPossibleManagers(employeeId)
            .then(([managers]) => {
              const managerChoices = managers.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
              }));
              prompt([
                {
                  type: "list",
                  name: "managerId",
                  message:
                    "Which employee do you want to set as manager for the selected employee?",
                  choices: managerChoices
                }
              ])
                .then(res => db.updateEmployeeManager(employeeId, res.managerId))
                .then(() => console.log("Personal overlord designated!"))
              .then(() => doTheThing())
          })
      })
    })

}