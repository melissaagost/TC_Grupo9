//este elemento debe ser capaz de setar 2 estados: mesa y reserva
//cuando se cancela una reserva -> se libera una mesa
//cuando se confirma una reserva -> se ocupa una mesa
//agregar funcion cancelar/ confrimar reserva a botones en la vista Mesas.tsx

interface OrderCardProps {
  showOrderActionToast: (message: string, type: 'success' | 'error' | 'info') => void
}

//ejemplo de como usar toast
// actualizarEstado.mutate(
//       { id, data: { nuevo_estado: nuevoEstado } },
//       {
//         onSuccess: (response) => {
//           if (response.data.actualizar_estado_pedido.success) {
//             showOrderActionToast(response.data.message || 'Estado actualizado con éxito', 'success')
//           } else {
//             showOrderActionToast(
//               response.data.message || 'No se pudo actualizar el estado',
//               'error'
//             )
//           }
//         },
//         onError: (error: any) => {
//           showOrderActionToast(
//             error?.response?.data?.message || error.message || 'Error al actualizar el estado',
//             'error'
//           )
//         },
//       }
//     )


const ReservationCard = ({ showOrderActionToast }: OrderCardProps) =>{

    return(

        <div>

        </div>

    );

};

 export default ReservationCard;