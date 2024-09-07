CREATE TABLE IF NOT EXISTS "Emis" (
  "id" SERIAL PRIMARY KEY,
  "loan_amount" DECIMAL(10, 2) NOT NULL,
  "interest_rate" DECIMAL(5, 2) NOT NULL,
  "loan_tenure_months" INTEGER NOT NULL,
  "emi" DECIMAL(10, 2) NOT NULL,
  "prepayment_amount" DECIMAL(10, 2),
  "remaining_balance" DECIMAL(10, 2) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);