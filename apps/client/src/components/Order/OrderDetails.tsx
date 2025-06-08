import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { useOrderLogic } from '../../hooks/useOrderLogic'

interface PedidoModalProps {
  open: boolean
  onClose: () => void
  idPedido: number | null
}

export default function PedidoModal({ open, onClose, idPedido }: PedidoModalProps) {
  const { cargarPedidoPorId } = useOrderLogic()
  const [pedido, setPedido] = useState<any>(null)

useEffect(() => {
  const fetchPedido = async () => {
    if (idPedido !== null) {
      const pedido = await cargarPedidoPorId(idPedido); // 👈 directamente el objeto
      console.log('Pedido cargado:', pedido);
      setPedido(pedido); // 👈 seteás directo
    }
  };
  fetchPedido();
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

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-bold">Detalles del Pedido</Dialog.Title>
            <div className="mt-4">
              {pedido ? (
                <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto max-h-60">
                  {JSON.stringify(pedido, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-gray-500">Cargando pedido...</p>
              )}
            </div>
            <div className="mt-6 text-right">
              <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Cerrar
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  )
}
