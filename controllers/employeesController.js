const data = {
    employees: require('../model/employees.json'),
    setEmployees: function(data) {
        console.log(data);
        this.employees = data;
    }
};

const getAllEmployees = (req, res) => {
    res.json(data.employees);
};

const createNewEmployee = (req, res) => {
    const newEmployee = {
        id: data.employees[data.employees.length -1].id + 1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    };
    data.setEmployees([...data.employees, newEmployee]);
    res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
    const employee = data.employees.find(item => item.id === parseInt(req.body.id));
    if (!employee) {
        return res.status(400).json({
            "message": `employee ID ${req.body.id} not found`
        });
    }
    employee.firstname = req.body.firstname;
    employee.lastname = req.body.lastname;
    res.json(data.employees);
};

const deleteEmployee = (req, res) => {
    const employee = data.employees.find(item => item.id === parseInt(req.body.id));
    if (!employee) {
        return res.status(400).json({
            "message": `employee ID ${req.body.id} not found`
        });
    }
    const filteredEmployees = data.employees.filter(item => item.id !== parseInt(req.body.id));
    data.setEmployees(filteredEmployees);
    res.json(data.employees);
}

const getEmployee = (req, res) => {
    const employee = data.employees.find(item => item.id === parseInt(req.params.id));
    if (!employee) {
        return res.status(400).json({
            "message": `employee ID ${req.body.id} not found`
        });
    }
    res.json(employee);
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}
