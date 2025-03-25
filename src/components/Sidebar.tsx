import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Store, Package2, ChevronRight, FileInput, Receipt, DollarSign, MessageSquare } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: Store, label: 'Shops', to: '/shops' },
  { icon: Package2, label: 'Products', to: '/products' },
  { 
    icon: FileInput, 
    label: 'Data Entry',
    to: '/data-entry',
    subItems: [
      { icon: Receipt, label: 'Sales', to: '/data-entry/sales' },
      { icon: DollarSign, label: 'Expenses', to: '/data-entry/expenses' },
      { icon: MessageSquare, label: 'Feedback', to: '/data-entry/feedback' }
    ]
  }
];

export const Sidebar: React.FC = () => {
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);

  return (
    <div className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">Tea Sales</h2>
      </div>
      <nav className="mt-4">
        {navItems.map((item) => (
          <div key={item.to}>
            {item.subItems ? (
              <>
                <button
                  onClick={() => setExpandedItem(expandedItem === item.to ? null : item.to)}
                  className={clsx(
                    'w-full flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors',
                    expandedItem === item.to && 'bg-emerald-50 text-emerald-700'
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                  <ChevronRight 
                    className={clsx(
                      "h-4 w-4 ml-auto transition-transform",
                      expandedItem === item.to && 'rotate-90'
                    )} 
                  />
                </button>
                {expandedItem === item.to && (
                  <div className="bg-gray-50">
                    {item.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.to}
                        to={subItem.to}
                        className={({ isActive }) =>
                          clsx(
                            'flex items-center px-4 py-2 pl-12 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors',
                            isActive && 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-500'
                          )
                        }
                      >
                        <subItem.icon className="h-4 w-4 mr-3" />
                        <span>{subItem.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors',
                    isActive && 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-500'
                  )
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
                <ChevronRight className="h-4 w-4 ml-auto" />
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};