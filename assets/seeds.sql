USE employee_trackerDB;  

-- Dept Values 

INSERT INTO department(id, department_name)
VALUE (1, "Production");

INSERT INTO department (id, department_name)
VALUE (2, "Design");

INSERT INTO department (id, department_name)
VALUE (3, "Programming");

INSERT INTO department (id, department_name)
VALUE (4, "Art");

-- Role Values

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Studio Manager", 95000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (2, "Lead Producer", 85000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (3, "Assistant Producer", 75000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (4, "Creative Director", 150000, 2);

INSERT INTO role (id, title, salary, department_id)
VALUES (5, "Lead Designer", 120000, 2);

INSERT INTO role (id, title, salary, department_id)
VALUES (6, "Game Designer", 100000, 2);

INSERT INTO role (id, title, salary, department_id)
VALUES (7, "Lead Programmer", 130000, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (8, "Game Programmer", 115000, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (9, "3D & Graphics Programmer", 90000, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (10, "Art Lead", 87000, 4);

INSERT INTO role (id, title, salary, department_id)
VALUES (11, "Concept Artist", 60000, 4);

INSERT INTO role (id, title, salary, department_id)
VALUES (12, "3D Modeling Artist", 57000, 4);


-- Employee Values

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (4, "Jacob", "Hines", 1, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (5, "Ben", "Bowers", 2, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (7, "Loretta", "Phelps", 3, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (10, "Katrina", "Stevenson", 4, 10);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (3, "Matthew", "Gutierrez", 5, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Katie", "Lambert", 6, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (2, "Luz", "Terry", 7, 2);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (6, "Shawn", "Lyons", 8,null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (8, "Dallas", "Campbell", 9, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (9, "Jackie", "Russell", 10, 9);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (12, "James", "Hawkins", 11, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (11, "Leticia", "Daniel", 12, null);

