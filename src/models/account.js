import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
const Account = (sequelize) => {
  return sequelize.define('Account', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      example: 'Jane'
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      example: 'Doe'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      example: 'jane.doe@example.com'
    },
    account_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    account_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    hooks: {
      beforeUpdate: (account, options) => {
        account.account_updated = new Date();
      },
      beforeCreate: async (account) => {
        if (account.changed('password')) {
          console.log("inside create acc" +account.password + "  " + account.email)
          account.password = await bcrypt.hash(account.password, 10);
        }
      },

      beforeUpdate: async (account) => {
        if (account.changed('password')) {
          console.log("inside update acc" + account.password, account.email)
          account.password = await bcrypt.hash(account.password, 10);
        }
        account.account_updated = new Date();
      }
    }
  });
};

export default Account;
