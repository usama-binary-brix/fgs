

import React from 'react';
import { TfiArrowTopRight } from "react-icons/tfi";
import { RxArrowBottomLeft } from "react-icons/rx";

interface InvestmentItem {
  id: number;
  inventory_id: number;
  investment_amount: string;
  status: string;
  created_at: string;
  inventory: {
    listing_number: string;
  };
}

export const RecentProfits = (data: any) => {
  // Format the API data to match the needed structure
  const formatInvestments = (investments: InvestmentItem[] | undefined) => {
    if (!investments) return [];

    return investments.map(investment => ({
      id: investment.inventory.listing_number,
      date: formatDate(investment.created_at),
      amount: parseFloat(investment.investment_amount),
      status: investment.status
    }));
  };

  // Format the date string to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    return date.toLocaleString('en-US', options);
  };

  // Get the formatted investments from the API data
  const profits = formatInvestments(data?.data?.latest_invenstment);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-semibold mb-4">Recent Investments</h1>
      <ul className="space-y-3">
        {profits.length > 0 ? (
          profits.slice(0, 5).map((profit) => {
            const isPositive = profit.amount >= 0;
            return (
              <li key={profit.id} className="border-b border-gray-100 pb-2 last:border-0">
                <div className="flex justify-between items-start">
                  <div className='flex items-center gap-3'>
                    <div className={`rounded-full p-3 ${isPositive ? 'bg-[#4CAF501A]' : 'bg-[#FF5F5F1A]'}`}>
                      {isPositive ? (
                        <TfiArrowTopRight className='text-[#4CAF50]' size={20} />
                      ) : (
                        <RxArrowBottomLeft className='text-[#FF5F5F]' size={20} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[#616161] text-[16px]">{profit.id}</p>
                      <p className="text-[14px] text-gray-500">{profit.date}</p>
                    </div>
                  </div>
                  <p className={`font-mono text-[14px] ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}
                    {profit.amount.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </li>
            );
          })
        ) : (
          <p className="text-gray-500 text-center py-4">No recent investments found</p>
        )}
      </ul>
    </div>
  );
};

export default RecentProfits;