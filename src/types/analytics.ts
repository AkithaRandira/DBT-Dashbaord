export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  cost: number;
  inventory_level: number;
  reorder_point: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  product_id: string;
  quantity: number;
  revenue: number;
  customer_age_group?: string;
  customer_gender?: string;
  customer_location?: string;
  payment_method: string;
  transaction_date: string;
  created_at: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description?: string;
  date: string;
  created_at: string;
}

export interface EmployeeHours {
  id: string;
  employee_id: string;
  hours_worked: number;
  date: string;
  created_at: string;
}

export interface CustomerFeedback {
  id: string;
  transaction_id: string;
  satisfaction_score: number;
  comments?: string;
  created_at: string;
}

export interface BusinessGoal {
  id: string;
  category: string;
  metric: string;
  target_value: number;
  current_value: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsDashboardData {
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
    yearToDate: number;
  };
  transactions: {
    count: number;
    averageValue: number;
    topProducts: Array<{
      product_id: string;
      name: string;
      quantity: number;
      revenue: number;
    }>;
  };
  inventory: {
    totalValue: number;
    lowStock: Array<{
      product_id: string;
      name: string;
      current_level: number;
      reorder_point: number;
    }>;
  };
  customerMetrics: {
    satisfactionScore: number;
    demographicsSummary: {
      age_groups: Record<string, number>;
      gender: Record<string, number>;
      locations: Record<string, number>;
    };
  };
  expenses: {
    monthly: number;
    byCategory: Record<string, number>;
  };
  goals: {
    active: number;
    completed: number;
    nearingDeadline: Array<BusinessGoal>;
  };
}