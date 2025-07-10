// utils/employeeIdGenerator.js
const UpdateModel = require("../models/update");

const getNextEmployeeId = async (prefix) => {
  const regex = new RegExp(`^${prefix}(\\d{3})$`);
  const lastEmployee = await UpdateModel
    .find({ employeeId: { $regex: regex } })
    .sort({ employeeId: -1 })
    .limit(1);

  let nextNumber = 1;
  if (lastEmployee.length > 0) {
    const match = lastEmployee[0].employeeId.match(regex);
    if (match && match[1]) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }

  return `${prefix}${String(nextNumber).padStart(3, '0')}`;
};

module.exports = getNextEmployeeId;
