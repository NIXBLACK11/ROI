const Emi = require('../models/Emi');
const { calculateEMI, generateMonthWisePayments } = require('../utils/emiCalculator');

exports.calculateEmi = async (req, res) => {
  try {
    const { loan_amount, interest_rate, loan_tenure_months, prepayment_amount } = req.body;

    const emi = calculateEMI(loan_amount, interest_rate, loan_tenure_months);
    const monthWisePayments = generateMonthWisePayments(loan_amount, interest_rate, loan_tenure_months, emi, prepayment_amount);

    const emiRecord = await Emi.create({
      loan_amount,
      interest_rate,
      loan_tenure_months: monthWisePayments.length,
      emi,
      prepayment_amount: prepayment_amount || null,
      remaining_balance: loan_amount-prepayment_amount,
    });

    res.status(201).json({
      id: emiRecord.id,
      loanAmount: loan_amount,
      interestRate: interest_rate,
      loanTenureMonths: loan_tenure_months,
      emi,
      prepayment: prepayment_amount || 0,
      monthWisePayments,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
      emi.loan_amount,
      emi.interest_rate,
      emi.loan_tenure_months,
      emi.emi,
      emi.prepayment_amount
    );

    res.status(200).json({
      ...emi.toJSON(),
      monthWisePayments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};