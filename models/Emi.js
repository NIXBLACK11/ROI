const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Emi = sequelize.define('Emi', {
  loan_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  interest_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  loan_tenure_months: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  emi: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  prepayment_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: null,
  },
  remaining_balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

module.exports = Emi;