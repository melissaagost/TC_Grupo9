import { useLocation } from 'react-router-dom';

const Title = () => {
  const location = useLocation();
const path = location.pathname;

 const getTitle = () => {
  if (path === '/payments-index') return 'Inicio';
  if (path === '/payments-index/payments') return 'Pagos';
  if (path === '/payments-index/payment-methods') return 'Métodos de Pago';
  return '';
};

  return (
    <h1 className="text-2xl pb-4 pl-2 text-gray-charcoal font-playfair font-bold border-b-3  border-gray-100">{getTitle()}</h1>
  );
};

export default Title;
