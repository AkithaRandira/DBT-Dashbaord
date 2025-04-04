import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Shops } from './pages/Shops';
import { SalesEntry } from './pages/data-entry/SalesEntry';
import { ExpensesEntry } from './pages/data-entry/ExpensesEntry'; 
import { FeedbackEntry } from './pages/data-entry/FeedbackEntry';
import { SalesList } from './pages/SalesList';
export const InvoiceDetail = () => {
  return <div>Invoice Detail Page</div>;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="shops" element={<Shops />} />
          <Route path="sales" element={<SalesList />} />
          <Route path="sales/:id" element={<InvoiceDetail />} /> {/* ✅ Add this line */}
          <Route path="data-entry">
            <Route path="sales" element={<SalesEntry />} />
            <Route path="expenses" element={<ExpensesEntry />} />
            <Route path="feedback" element={<FeedbackEntry />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
