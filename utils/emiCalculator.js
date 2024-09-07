function calculateEMI(loanAmount, interestRate, loanTenureMonths) {
  const monthlyRate = interestRate / 12 / 100;
  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenureMonths)) /
              (Math.pow(1 + monthlyRate, loanTenureMonths) - 1);
  return Number(emi.toFixed(2));
}

function generateMonthWisePayments(loanAmount, interestRate, loanTenureMonths, emi, prepayment) {
  let balance = loanAmount;
  const monthlyRate = interestRate / 12 / 100;
  const payments = [];

  for (let month = 1; month <= loanTenureMonths; month++) {
    const interestPaid = Number((balance * monthlyRate).toFixed(2));
    let principalPaid = Number((emi - interestPaid).toFixed(2));
    let prepaymentAmount = 0;

    if (month === 1 && prepayment) {
      prepaymentAmount = prepayment;
      balance -= prepayment;
    }

    balance = Number((balance - principalPaid).toFixed(2));

    payments.push({
      month,
      emiPaid: Number(emi.toFixed(2)),
      interestPaid,
      principalPaid,
      prepayment: prepaymentAmount,
      remainingBalance: balance
    });

    if (balance <= 0) break;
  }

  return payments;
}

module.exports = { calculateEMI, generateMonthWisePayments };