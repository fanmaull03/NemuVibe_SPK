import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const LABELS = [
  'Digital (C1)',
  'Harga (C2)',
  'Estetika (C3)',
  'Tenang (C4)',
  'Hiburan (C5)',
  'Rasa (C6)',
];

export default function RadarChart({ cafe }) {
  const values = cafe
    ? [
        cafe.c1_digital  ?? 0,
        cafe.c2_harga    ?? 0,
        cafe.c3_suasana  ?? 0,
        cafe.c4_tenang   ?? 0,
        cafe.c5_hiburan  ?? 0,
        cafe.c6_rasa     ?? 0,
      ]
    : [0, 0, 0, 0, 0, 0];

  const data = {
    labels: LABELS,
    datasets: [
      {
        label: cafe?.nama ?? 'Cafe',
        data: values,
        backgroundColor: 'rgba(0, 71, 171, 0.15)',
        borderColor: '#0047AB',
        borderWidth: 2,
        pointBackgroundColor: '#FFD700',
        pointBorderColor: '#0047AB',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          font: { family: 'Plus Jakarta Sans', size: 10 },
          color: '#9ca3af',
          backdropColor: 'transparent',
        },
        grid:        { color: 'rgba(0,0,0,0.07)' },
        angleLines:  { color: 'rgba(0,0,0,0.07)' },
        pointLabels: {
          font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
          color: '#374151',
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` Skor: ${ctx.raw}/5`,
        },
        titleFont:  { family: 'Plus Jakarta Sans' },
        bodyFont:   { family: 'Plus Jakarta Sans' },
      },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: 320, margin: '0 auto' }}>
      <Radar data={data} options={options}/>
    </div>
  );
}
