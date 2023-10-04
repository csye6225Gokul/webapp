import { DataTypes } from 'sequelize';
import momentTimezone from 'moment-timezone'
import  moment from 'moment-timezone';
const Assignment = (sequelize) => {
  return sequelize.define('Assignment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // Custom validation to ensure 'name' is a string
        isString(value) {
          if (typeof value !== 'string') {
            throw new Error('Name must be a string.');
          }
        },
      },
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 100
      }
    },
    num_of_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 100
      }
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
      // validate: {
      //   // Custom validation to ensure 'deadline' is in the future
      //   isFutureDate(value) {
      //     const options = {
      //       timeZone: 'America/New_York', // Eastern Standard Time (EST)
      //       year: 'numeric',
      //       month: '2-digit',
      //       day: '2-digit',
      //       hour: '2-digit',
      //       minute: '2-digit',
      //       second: '2-digit',
      //     };
      //     const date = moment.tz(Date.now().toLocaleString, 'America/New_York');
      //     const currentDateAndTimeString = new Date().toLocaleString('en-US', options);
      //     console.log(date)
       
      //     const currentDateAndTime = new Date(currentDateAndTimeString);
      //     console.log(currentDateAndTime)
      //     if (value < currentDateAndTime) {
      //       throw new Error('Deadline must be in the future.');
      //     }
      //   },
      // },
    },
    assignment_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    assignment_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
    // creatorId: {
    //   type: DataTypes.UUID,
    //   allowNull: false
    // }
  }, {
    hooks: {
      beforeUpdate: (assignment) => {
        assignment.assignment_updated = new Date();
      }
    }
  });
};

export default Assignment;
