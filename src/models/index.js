import AccountModel from './account.js'; 
import sequelize from './database.js';
import AssignmentModel from './assignment.js';
import SubmissionModel from './submission.js';

const Account = AccountModel(sequelize);
const Assignment = AssignmentModel(sequelize);
const Submission = SubmissionModel(sequelize);
 
Account.hasMany(Assignment, { as: "Assignments", foreignKey: "creatorId" });
Assignment.belongsTo(Account, { as: "Creator", foreignKey: "creatorId" });
Assignment.hasMany(Submission, { 
    foreignKey: 'assignment_id', 
    as: 'Submissions' 
  });
  
  Submission.belongsTo(Assignment, { 
    foreignKey: 'assignment_id', 
    as: 'Assignment' 
  });
  

export { Account, Assignment, Submission };
