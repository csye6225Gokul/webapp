import AccountModel from './account.js'; 
import sequelize from './database.js';
import AssignmentModel from './assignment.js';

const Account = AccountModel(sequelize);
const Assignment = AssignmentModel(sequelize);
Account.hasMany(Assignment, { as: "Assignments", foreignKey: "creatorId" });
Assignment.belongsTo(Account, { as: "Creator", foreignKey: "creatorId" });


export { Account , Assignment };