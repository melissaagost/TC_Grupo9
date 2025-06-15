import {Charts} from "../components/Payment/Charts"

const PaymentIndex = () => {
  const pagosData = { pagado: 87, cancelado: 13 };
  const metodosPagoData = { activos: 5, inactivos: 2 };

  return (
    <main className="min-h-screen bg-blood-100/5 p-6">
      <h1 className="text-2xl font-playfair font-semibold text-center mb-6">Resumen de Pagos</h1>
      <Charts
        pagosData={pagosData}
        metodosPagoData={metodosPagoData}
      />
    </main>);
};

export default PaymentIndex;