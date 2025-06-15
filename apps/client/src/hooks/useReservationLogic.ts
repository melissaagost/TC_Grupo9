//este elemento debe ser capaz de setar 2 estados: mesa y reserva
//cuando se cancela una reserva -> se libera una mesa
//cuando se confirma una reserva -> se ocupa una mesa
//agregar funcion cancelar/ confrimar reserva a botones en la vista Mesas.tsx
//emitir mensajes como pedidos

//como setear mensajes
// if (!mesaSeleccionada || orden.length === 0) {
//         return { success: false, message: "Debe seleccionar una mesa y agregar al menos un producto.", type: 'error' };
//       }


import { useEffect, useState } from "react";
import { setMesaLibre, setMesaOcupado, getAllMesas, getMesaById, setMesaReservado } from '../services/tableService';

export const UseReservationLogic = () =>{
    return{};
};
