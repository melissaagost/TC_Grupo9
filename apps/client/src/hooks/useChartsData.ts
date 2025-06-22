import { useEffect, useState } from 'react';
import { PaymentService } from "../services/paymentService";
import { orderService } from "../services/orderService";
import { useQuery } from "@tanstack/react-query";
import { FiltroBase, PagoRowDTO, MetodoPagoRow } from "../types/paymentTypes";
import { Paginado } from "../types/itemTypes";

type ChartData = {
  pagosData: {
    pagado: number;
    cancelado: number;
  };
  metodosPagoData: {
    activos: number;
    inactivos: number;
  };
  pedidosPorMes: {
    [mes: string]: number;
  };
};

export function useChartData() {
  const [data, setData] = useState<ChartData>({
    pagosData: { pagado: 0, cancelado: 0 },
    metodosPagoData: { activos: 0, inactivos: 0 },
    pedidosPorMes: {},
  });

  const { data: pagosData } = useQuery({
    queryKey: ["pagos-chart"],
    queryFn: async () => {
      const res = await PaymentService.listarPagos({ pageSize: 1000, pageIndex: 1 });
      const paginado = res.data as unknown as Paginado<PagoRowDTO>;
      return paginado?.data ?? [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: metodosPagoData } = useQuery({
    queryKey: ["metodos-pago-chart"],
    queryFn: async () => {
      const res = await PaymentService.buscarMetodosPago({ pageSize: 1000, pageIndex: 1 });
      const paginado = res.data as unknown as Paginado<MetodoPagoRow>;
      return paginado?.data ?? [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: pedidosData } = useQuery({
    queryKey: ["pedidos-chart"],
    queryFn: async () => {
      const res = await orderService.listar();
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (pagosData && metodosPagoData && pedidosData) {
      // Process pagos data
      const pagado = pagosData.filter((p) => p.estado === 1).length;
      const cancelado = pagosData.filter((p) => p.estado === 0).length;

      // Process payment methods data
      const activos = metodosPagoData.filter((m) => m.estado === 1).length;
      const inactivos = metodosPagoData.filter((m) => m.estado === 0).length;

      // Process orders data
      const pedidosPorMes: { [mes: string]: number } = {};
      pedidosData.forEach((p: any) => {
        const fecha = new Date(p.fecha);
        const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        pedidosPorMes[mes] = (pedidosPorMes[mes] || 0) + 1;
      });

      setData({
        pagosData: { pagado, cancelado },
        metodosPagoData: { activos, inactivos },
        pedidosPorMes,
      });
    }
  }, [pagosData, metodosPagoData, pedidosData]);

  return data;
}
