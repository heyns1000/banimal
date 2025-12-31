import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function GrowthChart() {
  const chartRef = useRef<ChartJS<"line">>(null);

  const data = {
    labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025'],
    datasets: [
      {
        label: 'Banimal Ecosystem Growth',
        data: [100, 250, 500, 1200, 2500, 4000],
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#D4AF37',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Traditional Integration',
        data: [100, 150, 220, 320, 440, 580],
        borderColor: '#9CA3AF',
        backgroundColor: 'rgba(156, 163, 175, 0.05)',
        fill: true,
        borderDash: [8, 4],
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#9CA3AF',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
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
        text: 'API Integration Growth Comparison',
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
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} integrations`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value: any) {
            return value.toLocaleString();
          },
          font: {
            size: 11,
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          }
        }
      }
    }
  };

  return (
    <div className="custom-card p-6 rounded-2xl">
      <div className="h-80">
        <Line ref={chartRef} data={data} options={options} />
      </div>
      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
        <p className="text-sm text-yellow-900 italic">
          The Banimal Ecosystem demonstrates exponential growth through comprehensive multi-platform integration and automated supply chain management.
        </p>
      </div>
    </div>
  );
}
