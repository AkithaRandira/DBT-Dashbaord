/*
  # Business Analytics System Schema

  1. New Tables
    - `transactions`
      - Core sales and transaction data
      - Includes revenue, customer info, and timestamps
    
    - `products`
      - Extended product information
      - Includes costs, inventory levels, and categories
    
    - `expenses`
      - Track operating and marketing costs
      - Categories and detailed descriptions
    
    - `employee_hours`
      - Staff working hours and productivity
    
    - `customer_feedback`
      - Customer satisfaction scores and comments
    
    - `business_goals`
      - Company targets and objectives
      - Track progress against KPIs
    
  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users
*/

-- Products table (enhanced)
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  price numeric(10,2) NOT NULL,
  cost numeric(10,2) NOT NULL,
  inventory_level integer NOT NULL DEFAULT 0,
  reorder_point integer NOT NULL DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  revenue numeric(10,2) NOT NULL,
  customer_age_group text,
  customer_gender text,
  customer_location text,
  payment_method text,
  transaction_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  amount numeric(10,2) NOT NULL,
  description text,
  date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Employee hours table
CREATE TABLE IF NOT EXISTS employee_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL,
  hours_worked numeric(4,2) NOT NULL,
  date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Customer feedback table
CREATE TABLE IF NOT EXISTS customer_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES transactions(id),
  satisfaction_score integer CHECK (satisfaction_score BETWEEN 1 AND 5),
  comments text,
  created_at timestamptz DEFAULT now()
);

-- Business goals table
CREATE TABLE IF NOT EXISTS business_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  metric text NOT NULL,
  target_value numeric(10,2) NOT NULL,
  current_value numeric(10,2) NOT NULL DEFAULT 0,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read products"
  ON products FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read transactions"
  ON transactions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read expenses"
  ON expenses FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read employee_hours"
  ON employee_hours FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read customer_feedback"
  ON customer_feedback FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read business_goals"
  ON business_goals FOR SELECT TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_employee_hours_date ON employee_hours(date);
CREATE INDEX IF NOT EXISTS idx_feedback_score ON customer_feedback(satisfaction_score);