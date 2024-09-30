// routing and mapping and http path methods

const express = require('express');

const employeeController = require('../controllers/employee-controller');

const router = express.Router();


router.get('/', employeeController.getEmployees);

router.get('/:eid', employeeController.getEmployeesByID);

router.post('/', employeeController.createEmployee);

router.patch('/:eid', employeeController.updateEmployee);

router.delete('/:eid', employeeController.deleteEmployee);

router.get('/getLogsByUsername/:userName', employeeController.getLogByUserName);

router.post('/actions', employeeController.createLoggingActions);

router.post('/login', employeeController.userLogin);


module.exports = router;