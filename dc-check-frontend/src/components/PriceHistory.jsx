import React from 'react';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';

const PriceHistory = ({ priceHistory, condition }) => {
  const data = {
    labels: priceHistory.map(p => format(new Date(p.timestamp), 'MM/dd/yyyy')),
    datasets: [{
      label: `${condition} Price History`,
      data: priceHistory.map(p => p[condition]),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Price History Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`
        }
      }
    }
  };

  return (
    <div className="w-full h-64 mt-4">
      <Line data={data} options={options} />
    </div>
  );
}; 