const mySql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const saltRounds = 10;

const connection = mySql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'abcd1234',
  database: 'employee_management',
});
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the MySQL database');
});


// *************************************  getEmployees API *********************************************

const getEmployees = async (req,res,next) => {
  try {
      const data = await connection.promise().query(
        `SELECT e.empID, e.empFirstName, e.empMiddleName, e.empLastName, e.empEmail, e.empDOB, e.empJobTitle,
            d.deptName,
            a.addressLine1, a.addressLine2, a.city, a.state, a.zip, a.emContact, a.emPhone, a.homePhone
              FROM employee e
              JOIN department d ON e.deptID = d.deptID
              JOIN employee_address a ON e.empID = a.empID;`
      );
      res.status(202).json({
        employee: data[0],
      });
    } catch (err) {
      res.status(500).json({
        message: err.message || "An error occurred while fetching the employees",
      });
    }
};

// *************************************  getEmployeeByID API *********************************************

const getEmployeesByID = async (req, res, next) => {
const empId = req.params.eid;
try {
  const data = await connection.promise().query(
    `SELECT e.empID, e.empFirstName, e.empMiddleName, e.empLastName, e.empEmail, e.empDOB, e.empJobTitle,
        d.deptName,
        a.addressLine1, a.addressLine2, a.city, a.state, a.zip, a.emContact, a.emPhone, a.homePhone
          FROM employee e
          JOIN department d ON e.deptID = d.deptID
          JOIN employee_address a ON e.empID = a.empID
          WHERE e.empID = ?;`, [empId]
  );

  if (data.length === 0) {
    return res.status(404).json({ message: "Employee not found" });
  }

  res.status(200).json({
    employee: data[0],
  });

} catch (err) {
  res.status(500).json({
    message: err.message || "An error occurred while fetching the employee details",
  });
} 

};

//  *************************************  create API *********************************************
const createEmployee = async (req, res, next) => {
  try {
    const {
      deptName, empFirstName, empMiddleName, empLastName, empEmail, empDOB, empJobTitle,
      addressLine1, addressLine2, city, state, zip, emContact, emPhone, homePhone, user_name, password
    } = req.body;


    // Generate ADID
    const firstChar = empFirstName.charAt(0).toUpperCase();
    const lastFour = empLastName.substring(0, 4).toUpperCase();

    // Determine the next available two-digit sequence
    const nextDigitsQuery = `SELECT IFNULL(MAX(CAST(SUBSTRING(ADID, -2) AS UNSIGNED)), 0) + 1 AS nextDigits 
                             FROM employee 
                             WHERE empFirstName = ? AND empLastName = ?`;
    const [nextDigitsResult] = await connection.promise().query(nextDigitsQuery, [empFirstName, empLastName]);
    const nextDigits = String(nextDigitsResult[0].nextDigits).padStart(2, '0');
    const ADID = `${firstChar}${lastFour}${nextDigits}`;

    // Start transaction
    connection.beginTransaction(async (err) => {
      if (err) throw err;

      try {
        // Insert department
        const insertDepartment = `INSERT INTO department (deptName) VALUES (?)`;
        const [departmentResult] = await connection.promise().query(insertDepartment, [deptName]);
        const deptID = departmentResult.insertId;

        // Insert employee
        const insertEmployee = `INSERT INTO employee (
          empFirstName, empMiddleName, empLastName, empEmail, empDOB, empJobTitle, deptID, ADID
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const [employeeResult] = await connection.promise().query(insertEmployee, [
          empFirstName, empMiddleName, empLastName, empEmail, empDOB, empJobTitle, deptID, ADID
        ]);
        const empID = employeeResult.insertId;

        // Insert address
        const insertAddress = `INSERT INTO employee_address (
          addressLine1, addressLine2, city, state, zip, emContact, emPhone, homePhone, empID
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        await connection.promise().query(insertAddress, [
          addressLine1, addressLine2, city, state, zip, emContact, emPhone, homePhone, empID
        ]);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert into the auth table
        const insertAuth = `INSERT INTO auth (user_name, password) VALUES (?, ?)`;
        await connection.promise().query(insertAuth, [
          user_name, 
          hashedPassword
        ]);


        // Commit transaction
        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              throw err;
            });
          }
          res.status(201).json({
            message: 'Employee created successfully',
            employee: {
              empID,
              empFirstName,
              empMiddleName,
              empLastName,
              empEmail,
              empDOB,
              empJobTitle,
              deptName,
              ADID,
              address: {
                addressLine1,
                addressLine2,
                city,
                state,
                zip,
                emContact,
                emPhone,
                homePhone,
              },
              auth: {
                user_name,
                hashedPassword
              },
            },
          });
        });
      } catch (err) {
        connection.rollback(() => {
          throw err;
        });
      }
    });

  } catch (err) {
    res.status(500).json({
      message: err.message || "An error occurred while creating the employee",
    });
  }
};


  // *************************************  update API *********************************************

  const updateEmployee = async (req, res, next) => {
      console.log("params.."+JSON.stringify(req.params));
      const empID  = req.params.eid;
      console.log("empID.."+empID);
      const { deptName, empFirstName, empMiddleName, empLastName, empEmail, empDOB, empJobTitle,
              addressLine1, addressLine2, city, state, zip, emContact, emPhone, homePhone } = req.body;
    
      try {
        connection.beginTransaction((err) => {
          if (err) throw err;
    
          // Update the department first
          const updateDepartment = `UPDATE department d
                                    JOIN employee e ON e.deptID = d.deptID
                                    SET d.deptName = ?
                                    WHERE e.empID = ?`;
          connection.query(updateDepartment, [deptName, empID], (err, result) => {
            if (err) {
              return connection.rollback(() => {
                throw err;
              });
            }
    
            // Update the employee details
            const updateEmployee = `UPDATE employee
                                    SET empFirstName = ?, empMiddleName = ?, empLastName = ?, empEmail = ?, empDOB = ?, empJobTitle = ?
                                    WHERE empID = ?`;
            connection.query(updateEmployee, [empFirstName, empMiddleName, empLastName, empEmail, empDOB, empJobTitle, empID], (err, result) => {
              if (err) {
                return connection.rollback(() => {
                  throw err;
                });
              }
    
              // Update the employee address details
              const updateAddress = `UPDATE employee_address
                                     SET addressLine1 = ?, addressLine2 = ?, city = ?, state = ?, zip = ?, emContact = ?, emPhone = ?, homePhone = ?
                                     WHERE empID = ?`;
              connection.query(updateAddress, [addressLine1, addressLine2, city, state, zip, emContact, emPhone, homePhone, empID], (err, result) => {
                if (err) {
                  return connection.rollback(() => {
                    throw err;
                  });
                }
    
                // Commit the transaction
                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      throw err;
                    });
                  }
                  /*res.status(200).json({
                    message: 'Employee updated successfully', // make sure to display the data
                  }); */
                });
                
                const getUpdatedData = async () => {
                  console.log("inside getUpdatedData..")
                  try {
                    const data = await connection.promise().query(
                      `SELECT e.empID, e.empFirstName, e.empMiddleName, e.empLastName, e.empEmail, e.empDOB, e.empJobTitle,
                          d.deptName,
                          a.addressLine1, a.addressLine2, a.city, a.state, a.zip, a.emContact, a.emPhone, a.homePhone
                            FROM employee e
                            JOIN department d ON e.deptID = d.deptID
                            JOIN employee_address a ON e.empID = a.empID
                            WHERE e.empID = ?;`, [empID]
                    );
                  
                    if (data.length === 0) {
                      return res.status(404).json({ message: "Employee not found" });
                    }
                  
                    res.status(200).json({
                      employee: data[0],
                    });
                  
                  } catch (err) {
                    res.status(500).json({
                      message: err.message || "An error occurred while fetching the employee details",
                    });
                  } 
                }
                getUpdatedData();

              });
            });
          });
        });
      } catch (err) {
        res.status(500).json({
          message: err.message || 'An error occurred while updating the employee',
        });
      }
    };


// *************************************  delete API *********************************************
const deleteEmployee = async (req, res, next) => {
const empID = req.params.eid;

try {
  connection.beginTransaction(async (err) => {
    if (err) throw err;

    // Delete from employee_address table first since it references empID
    const deleteAddressQuery = `DELETE FROM employee_address WHERE empID = ?`;
    connection.query(deleteAddressQuery, [empID], (err, result) => {
      if (err) {
        return connection.rollback(() => {
          throw err;
        });
      }

      // Delete from employee table
      const deleteEmployeeQuery = `DELETE FROM employee WHERE empID = ?`;
      connection.query(deleteEmployeeQuery, [empID], (err, result) => {
        if (err) {
          return connection.rollback(() => {
            throw err;
          });
        }

        // If no rows were deleted, the employee does not exist
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Employee not found" });
        }

        // Commit the transaction
        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              throw err;
            });
          }

          res.status(200).json({ message: "Employee deleted successfully" });
        });
      });
    });
  });
} catch (err) {
  res.status(500).json({
    message: err.message || "An error occurred while deleting the employee",
  });
}
};

// ****************************** log files Post API ********************************


//format the date and time to MySQL DATETIME format
function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


// // createLog POST API
// const createLoggingActions = async (req, res, next) => {

//   console.log('into post logging action');

//   const {user_name, action } = req.body;

//   if(!action || !user_name) {
//     return res.status(404).json({error: 'Action and user_name are required.'});
//   }

//   const time = formatDateTime(new Date()); 

//   // Insert log into the Log table
//   const query = `INSERT INTO Log (date_time, user_name, action_performed) VALUES (?, ?, ?)`;

//   connection.execute(query, [time, user_name, action], (err, results) => {
//     if (err) {
//         console.error('Error inserting log:', err);
//         return res.status(500).json({ error: 'Failed to log the action.' });
//     }
//     res.status(200).json({
//       logs: logs,
//       message: 'Log created successfully.'
//     });
// });
// }



const createLoggingActions = async (req, res, next) => {
  console.log("Req body.."+JSON.stringify(req.body));
  const { user_name, action } = req.body;

  if(!action || !user_name) {
        return res.status(404).json({error: 'Action and user_name are required.'});
   }

   const time = formatDateTime(new Date()); 

   const query = `INSERT INTO Log (date_time, user_name, action_performed) VALUES (?, ?, ?)`;

   connection.execute(query, [time, user_name, action], (err, results) => {
        if (err) {
            console.error('Error inserting log:', err);
            return res.status(500).json({ error: 'Failed to log the action.' });
        }
        res.status(200).json({
          message: 'Log created successfully.'
        });
      });
 
};


// *************************** getLogByUserName API *****************************

const getLogByUserName = async (req, res, next) => {
  console.log('inside get log by username..' + JSON.stringify(req.params));
  const  userName  = req.params.userName;

  try {
    const [rows] = await connection.promise().query(
      `SELECT user_name, action_performed, DATE_FORMAT(date_time, '%y-%m-%d %H:%i:%s') AS formatted_date 
       FROM Log WHERE user_name = ?`, [userName]
    );

     console.log('Query result:', rows);


    if (rows.length === 0) {
      return res.status(404).json({ message: "Logs not found for the given username." });
    }

    // Format the response
    const logs = rows.map(row => ({
      username: row.user_name,
      action: row.action_performed,
      date: row.formatted_date,
    }));

    res.status(200).json({
      logs: logs,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message || "An error occurred while fetching the logs",
    });
  }
};


// // ****************************************** Login API ******************************************


const userLogin = async (req, res, next) => {

  console.log("Req body.."+JSON.stringify(req.body));
  const { user_name, password } = req.body;

  // Ensure both username and password are provided
  if (!user_name || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Fetch the user from the database by username
    const [user] = await connection.promise().query(
      'SELECT * FROM auth WHERE user_name = ?', [user_name]
    );
    // If user is not found
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract user details
    const foundUser = user[0];
    console.log("foundUser.." +JSON.stringify(foundUser));

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

   if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Create a JWT token with the user ID and username
    const token = jwt.sign(
      {user_name: foundUser.user_name },
      JWT_SECRET,
      { expiresIn: '1h' } // The token will expire in 1 hour
    );

    // Return the token to the client
    res.status(200).json({
      message: 'Login successful',
      token, // Include the JWT in the response
    });

  } catch (err) {
    res.status(500).json({ message: 'An error occurred while logging in' });
  }
};





exports.getEmployees = getEmployees;
exports.getEmployeesByID = getEmployeesByID;
exports.createEmployee = createEmployee;
exports.updateEmployee = updateEmployee;
exports.deleteEmployee = deleteEmployee;
exports.createLoggingActions = createLoggingActions;
exports.getLogByUserName = getLogByUserName;
exports.userLogin = userLogin;

