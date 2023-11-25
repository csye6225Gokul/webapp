import { DataTypes } from 'sequelize';

const Submission = (sequelize) => {
  return sequelize.define('Submission', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    assignment_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Assignments', // Name of the Assignment model/table
        key: 'id',           // Key in Assignment model to which it refers
      }
    },
    submission_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    submission_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    creatorId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    assignment_updated: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    // Additional model options go here
  });
};

export default Submission;
