export interface Product {
  id: string;
  name: string;
  price: number;
  created_at: string;
}

export interface Store {
  id: string;
  name: string;
  type: 'retail' | 'direct';
  region?: string;
  created_at: string;
}

export interface Sale {
  id: string;
  product_id: string;
  store_id: string;
  quantity: number;
  total_amount: number;
  sale_date: string;
  created_at: string;
}

export interface SalesSummary {
  total: number;
  byProduct: { [key: string]: number };
  byStore: { [key: string]: number };
  retailVsDirect: {
    retail: number;
    direct: number;
  };
  monthlyTrends: Array<{
    month: string;
    total: number;
  }>;
  bestPerforming: {
    product: string;
    store: string;
  };
}