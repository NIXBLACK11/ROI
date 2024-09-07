const Emi = require('../models/Emi');
const { calculateEMI, generateMonthWisePayments } = require('../utils/emiCalculator');

exports.calculateEmi = async (req, res) => {
  try {
    const { loan_amount, interest_rate, loan_tenure_months, prepayment_amount } = req.body;

    if (!loan_amount || !interest_rate || !loan_tenure_months) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const loanAmount = Number(loan_amount);
    const interestRate = Number(interest_rate);
    const loanTenureMonths = Number(loan_tenure_months);
    const prepaymentAmount = prepayment_amount ? Number(prepayment_amount) : 0;

    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTenureMonths) || isNaN(prepaymentAmount)) {
      return res.status(400).json({ error: 'Invalid input: All numerical fields must be valid numbers' });
    }

    if (loanAmount <= 0) {
      return res.status(400).json({ error: 'Loan amount must be greater than 0' });
    }

    if (interestRate < 0 || interestRate > 100) {
      return res.status(400).json({ error: 'Interest rate must be between 0 and 100' });
    }

    if (loanTenureMonths <= 0 || !Number.isInteger(loanTenureMonths)) {
      return res.status(400).json({ error: 'Loan tenure must be a positive integer' });
    }

    if (prepaymentAmount < 0) {
      return res.status(400).json({ error: 'Prepayment amount cannot be negative' });
    }

    if (prepaymentAmount >= loanAmount) {
      return res.status(400).json({ error: 'Prepayment amount must be less than the loan amount' });
    }

    const emi = calculateEMI(loanAmount, interestRate, loanTenureMonths);
    const monthWisePayments = generateMonthWisePayments(loanAmount, interestRate, loanTenureMonths, emi, prepaymentAmount);

    const remainingBalance = loanAmount - prepaymentAmount;

    const emiRecord = await Emi.create({
      loan_amount: loanAmount,
      interest_rate: interestRate,
      loan_tenure_months: monthWisePayments.length,
      emi,
      prepayment_amount: prepaymentAmount || null,
      remaining_balance: remainingBalance,
    });

    res.status(201).json({
      id: emiRecord.id,
      loanAmount,
      interestRate,
      loanTenureMonths,
      emi,
      prepayment: prepaymentAmount,
      remainingBalance,
      monthWisePayments,
    });
  } catch (error) {
    console.error('Error in calculateEmi:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};

exports.getAllEmis = async (req, res) => {
  try {
    const emis = await Emi.findAll();
    res.status(200).json(emis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmiById = async (req, res) => {
  try {
    const emi = await Emi.findByPk(req.params.id);
    if (!emi) {
      return res.status(404).json({ error: 'EMI record not found' });
    }
    
    const monthWisePayments = generateMonthWisePayments(
      parseFloat(emi.loan_amount),
      parseFloat(emi.interest_rate),
      parseInt(emi.loan_tenure_months),
      parseFloat(emi.emi),
      emi.prepayment_amount ? parseFloat(emi.prepayment_amount) : 0
    );

    res.status(200).json({
      id: emi.id,
      loanAmount: parseFloat(emi.loan_amount),
      interestRate: parseFloat(emi.interest_rate),
      loanTenureMonths: parseInt(emi.loan_tenure_months),
      emi: parseFloat(emi.emi),
      prepayment: emi.prepayment_amount ? parseFloat(emi.prepayment_amount) : 0,
      remainingBalance: parseFloat(emi.remaining_balance),
      monthWisePayments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};