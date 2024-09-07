# EMI Calculator API

This project implements a simple REST API for an EMI (Equated Monthly Installment) calculator with a prepayment option using Node.js and PostgreSQL.

## Setup

1. **Clone the project:**
   ```bash
   git clone project_url
   ```

2. **Navigate to the project directory:**
   ```bash
   cd project
   ```

3. **Start the PostgreSQL server:**
   ```bash
   docker-compose up -d
   ```

4. **Copy `.env.example` to `.env` and update the database credentials.**

5. **Install dependencies:**
   ```bash
   npm install
   ```

6. **Run the application:**
   ```bash
   npm run dev
   ```

### Database Setup

7. **Copy the SQL file to the container:**
   ```bash
   docker cp create_emi_table.sql emi_calculator_postgres:/create_emi_table.sql
   ```

8. **Execute the SQL file:**
   ```bash
   docker exec -i emi_calculator_postgres psql -U username -d emi_calculator -f /create_emi_table.sql
   ```

---

### Non-Essential Commands (Optional)

- **Stop the container (without deleting data):**
   ```bash
   docker-compose down
   ```

- **Delete the volume data (Warning: This will remove all data):**
   ```bash
   docker volume rm myroiassignment_postgres_data
   ```

- **Access the database inside the container:**
   ```bash
   docker exec -it emi_calculator_postgres bash
   psql -U username -d emi_calculator
   ```

- **Example database commands:**
   ```bash
   \dt
   select * from "Emis";
   ```

## API Endpoints

- POST `/api/calculate-emi`: Calculate EMI and store in database
- GET `/api/emis`: Fetch all EMI records
- GET `/api/emi/:id`: Fetch a specific EMI record by ID

## Testing

Use Postman or any API testing tool to test the endpoints. Make sure to set the `Content-Type` header to `application/json` for POST requests.

Example POST request body:

```json
{
  "loan_amount": 500000,
  "interest_rate": 8.5,
  "loan_tenure_months": 60,
  "prepayment_amount": 20000
}
```