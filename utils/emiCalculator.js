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
    const interestPaid = balance * monthlyRate;
    let principalPaid = emi - interestPaid;
    let prepaymentAmount = 0;

    if (month === 1 && prepayment) {
      prepaymentAmount = prepayment;
      balance -= prepayment;
    }

    if (balance < emi) {
      principalPaid = balance;
      emi = balance + interestPaid;
    }

    balance -= principalPaid;

    payments.push({
      month,
      emiPaid: Number(emi.toFixed(2)),
      interestPaid: Number(interestPaid.toFixed(2)),
      principalPaid: Number(principalPaid.toFixed(2)),
      prepayment: prepaymentAmount,
      remainingBalance: Number(balance.toFixed(2)),
    });

    if (balance <= 0) break;
  }

  return payments;
}

module.exports = { calculateEMI, generateMonthWisePayments };