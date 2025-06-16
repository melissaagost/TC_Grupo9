import { Charts } from "../components/Payment/Charts";
import { useChartData } from "../hooks/useChartsData";

const PaymentIndex = () => {
  const { pagosData, metodosPagoData, pedidosPorMes } = useChartData();

  return (
    <main className="min-h-screen bg-blood-100/5 p-6">
      <h1 className="text-2xl font-playfair font-semibold text-center mb-6">Resumen de Pagos</h1>
      <Charts
        pagosData={pagosData}
        metodosPagoData={metodosPagoData}
        pedidosPorMes={pedidosPorMes}
      />
    </main>
  );
};

export default PaymentIndex;
