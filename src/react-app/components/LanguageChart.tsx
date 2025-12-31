import { useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function LanguageChart() {
  const chartRef = useRef<ChartJS<"doughnut">>(null);

  const data = {
    labels: ['Primary Markets', 'Regional Languages', 'Emerging Markets'],
    datasets: [
      {
        data: [48, 35, 17],
        backgroundColor: [
          '#2D5A27', // Green
          '#D4AF37', // Gold
          '#6B46C1', // Purple
        ],
        borderColor: '#fff',
        borderWidth: 3,
        hoverOffset: 8,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Roboto, sans-serif',
            size: 12,
            weight: 500,
          }
        }
      },
      title: {
        display: true,
        text: 'Global Language Distribution',
        font: {
          family: 'Playfair Display, serif',
          size: 16,
        },
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed}% of languages`;
          }
        }
      }
    },
    cutout: '65%',
  };

  return (
    <div className="custom-card p-6 rounded-2xl">
      <div className="h-80 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <Doughnut ref={chartRef} data={data} options={options} />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl font-black text-green-700">12+</div>
          <div className="text-xs font-medium text-green-600 uppercase tracking-wide mt-1">Languages</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-2xl font-black text-yellow-700">120</div>
          <div className="text-xs font-medium text-yellow-600 uppercase tracking-wide mt-1">Brands</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-2xl font-black text-purple-700">5.2B</div>
          <div className="text-xs font-medium text-purple-600 uppercase tracking-wide mt-1">People</div>
        </div>
      </div>
    </div>
  );
}
