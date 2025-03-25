import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Shops } from './pages/Shops';
import { SalesEntry } from './pages/data-entry/SalesEntry';
import { ExpensesEntry } from './pages/data-entry/ExpensesEntry';
import { FeedbackEntry } from './pages/data-entry/FeedbackEntry';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="shops" element={<Shops />} />
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

export default App