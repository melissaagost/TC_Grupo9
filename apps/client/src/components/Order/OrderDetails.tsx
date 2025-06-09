import { Dialog, Transition } from '@headlessui/react'
import axiosInstance from '../../services/axiosInstance'
import { Fragment, useEffect, useState } from 'react'
import { PedidoRowDTO } from '../../types/orderTypes'

interface OrderDetailsProps {
  open: boolean
  onClose: () => void
  idPedido: number | null
}

export default function OrderDetails({ open, onClose, idPedido }: OrderDetailsProps) {
    const [detalles, setDetalles] = useState<PedidoRowDTO[] | null>(null);



    useEffect(() => {
    const fetchDetalles = async () => {
        if (idPedido !== null) {
        try {
            const response = await axiosInstance.get(`/pedido/buscar/${idPedido}`); //para no modificar el service que ya funciona correctamente para modificar el pedido
            setDetalles(response.data);
        } catch (err) {
            console.error('No se pudieron cargar los detalles extendidos del pedido', err);
        }
        }
    };

    fetchDetalles();
    }, [idPedido]);


  return (

    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center font-urbanist justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-eggshell-greekvilla p-6 shadow-xl">
            <Dialog.Title className="text-lg font-playfair text-gray-700 font-bold">Detalles del Pedido</Dialog.Title>

                {/* {detalles && (
                    <pre className="text-xs bg-yellow-100 p-2 mt-4 rounded">
                        {JSON.stringify(detalles, null, 2)}
                    </pre>
                )}
 */}

                {Array.isArray(detalles) && detalles.length > 0 ? (
                <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Pedido N°:</strong> {detalles[0].id_pedido}</p>
                    <p><strong>Fecha:</strong> {new Date(detalles[0].fecha).toLocaleDateString()}</p>
                    <p><strong>Estado:</strong> {detalles[0].estado_descripcion}</p>
                    <p><strong>Mesa:</strong> {detalles[0].numero_mesa} – {detalles[0].descripcion_mesa}</p>
                    <p><strong>Usuario:</strong> {detalles[0].usuario_nombre} ({detalles[0].tipo_usuario})</p>

                    <div className="mt-4">
                    <strong>Items:</strong>
                    <ul className="list-disc list-inside">
                        {detalles.map((item, index) => (
                        <li key={index}>
                            <p className="font-medium">{item.nombre_item}</p>
                            <p className="text-gray-600 text-xs italic">{item.descripcion_item}</p>
                            <p>
                            Cantidad: {item.cantidad_item} – Subtotal: ${item.subtotal_item}
                            </p>
                        </li>
                        ))}
                    </ul>
                    </div>

                    <p className="text-right mt-2 font-bold">
                    Total: ${detalles.reduce((acc, item) => acc + Number(item.subtotal_item), 0).toFixed(2)}
                    </p>
                </div>
                ) : (
                <p className="text-sm text-gray-500">Cargando detalles del pedido...</p>
                )}



            <div className="mt-6 text-right">
              <button onClick={onClose} className="px-4 py-2 bg-blood-100 text-white rounded hover:bg-blood-300">
                Cerrar
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  )
}
