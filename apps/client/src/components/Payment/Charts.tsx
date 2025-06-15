// src/components/ChartsSection.tsx
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

type ChartsSectionProps = {
  pagosData: {
    pagado: number;
    cancelado: number;
  };
  metodosPagoData: {
    activos: number;
    inactivos: number;
  };
};

export function Charts({ pagosData, metodosPagoData }: ChartsSectionProps) {
  const barData = {
    labels: ['Pagado', 'Cancelado'],
    datasets: [
      {
        label: 'Cantidad de Pagos',
        data: [pagosData.pagado, pagosData.cancelado],
        backgroundColor: ['#4ade80', '#f87171'],
        borderRadius: 8,
      },
    ],
  };

  const doughnutData = {
    labels: ['Activos', 'Inactivos'],
    datasets: [
      {
        data: [metodosPagoData.activos, metodosPagoData.inactivos],
        backgroundColor: ['#60a5fa', '#9ca3af'],
        borderWidth: 2,
      },
    ],
  };

    const lineData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
        datasets: [
            {
            label: 'Pedidos por Mes',
            data: [65, 58, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgba(34, 197, 94, 1)',
            tension: 0.3,
            pointBackgroundColor: 'rgba(34, 197, 94, 1)',
            pointRadius: 5,
            },
        ],
    };


  return (
    <div className="grid md:grid-cols-2 font-urbanist gap-6 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Estado de Pagos</h2>
        <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>

      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Métodos de Pago</h2>
        <Doughnut data={doughnutData} options={{ responsive: true }} />
      </div>


      <div className="md:col-span-2 bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Pedidos por Mes</h2>
        <Line data={lineData} options={{ responsive: true }} />
      </div>

    </div>
  );
}
