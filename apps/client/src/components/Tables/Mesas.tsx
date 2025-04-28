import { useEffect, useState } from "react";
import { getAllMesas, setMesaLibre, setMesaOcupado, updateMesa, createMesa } from "../../services/tableService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../UI/Dialog";
import Toast from "../UI/Toast";



const MesasTable = () => {

    const [mesas, setMesas] = useState<any[]>([]);

    useEffect(() => {
        fetchMesas();
    }, []);

    const fetchMesas = async () => {
        try {
        const data = await getAllMesas();
        setMesas(data);
        } catch (error) {
        console.error('Error fetching mesas:', error);
        }
    };

    const marcarLibre = async (id: number) => {
        const mesa = mesas.find((m) => m.id_mesa === id);

        if (!mesa) {
          console.error("Mesa no encontrada");
          return;
        }

        if (mesa.estado === 0) {
          setToastMessage("La mesa ya está libre");
          setToastType('info');
          return; // no hacemos nada porque ya está libre
        }

        try {
          await setMesaLibre(id);
          await fetchMesas();
          setToastMessage("Mesa marcada como libre correctamente");
          setToastType("success");
        } catch (error) {
          console.error("Error al marcar como libre", error);
          setToastMessage("Error al marcar la mesa como libre");
          setToastType("error");
        }
      };

      const marcarOcupado = async (id: number) => {
        const mesa = mesas.find((m) => m.id_mesa === id);

        if (!mesa) {
          console.error("Mesa no encontrada");
          return;
        }

        if (mesa.estado === 1) {
          setToastMessage("La mesa ya está ocupada");
          setToastType("info");
          return; // no hacemos nada porque ya está ocupada
        }

        try {
          await setMesaOcupado(id);
          await fetchMesas();
          setToastMessage("Mesa marcada como ocupada correctamente");
          setToastType("success");
        } catch (error) {
          console.error("Error al marcar como ocupada", error);
          setToastMessage("Error al marcar la mesa como ocupada");
          setToastType("error");
        }
      };

    const [numero, setNumero] = useState<number>(0);
    const [capacidad, setCapacidad] = useState<number>(0);
    const [descripcion, setDescripcion] = useState<string>("");
    const [idRestaurante, setIdRestaurante] = useState<number>(1); // ajustar si hubiera mas rest.


    const handleCreateMesa = async (e: React.FormEvent) => {
        e.preventDefault();

        // VALIDACIÓN antes de crear
        if (numero <= 0 || capacidad <= 0 || descripcion.trim() === "") {
          setToastMessage("Por favor completa todos los campos antes de crear");
          setToastType("info");
          return;
        }

        try {
          await createMesa({
            numero,
            capacidad,
            descripcion,
            id_restaurante: idRestaurante,
          });

          console.log("Mesa creada correctamente");
          setIsCreating(false); // cerrar modal
          fetchMesas(); // refrescar tabla

          // limpiar form
          setNumero(0);
          setCapacidad(0);
          setDescripcion("");

          setToastMessage("Mesa creada exitosamente");
          setToastType("success");

        } catch (error) {
          console.error("Error al crear mesa", error);
          setToastMessage("Error al crear mesa");
          setToastType("error");
        }
      };


    const handleUpdateMesa = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMesa) return;

        // VALIDACIÓN: No hubo cambios
        if (
          editingMesa.numero === editNumero &&
          editingMesa.capacidad === editCapacidad &&
          editingMesa.descripcion === editDescripcion
        ) {
          setToastMessage("No hay cambios para guardar");
          setToastType("info");
          return;
        }

        try {
          await updateMesa(editingMesa.id_mesa, {
            numero: editNumero,
            capacidad: editCapacidad,
            descripcion: editDescripcion,
            id_restaurante: 1, // ya sabemos que siempre es 1
          });

          console.log("Mesa actualizada correctamente");
          setToastMessage("Mesa actualizada correctamente");
          setToastType("success");

          fetchMesas(); // refresca la lista
          setEditingMesa(null); // cierra modal
        } catch (error) {
          console.error("Error al actualizar mesa", error);
          setToastMessage("Error al actualizar mesa");
          setToastType("error");
        }
      };


      const startEditingMesa = (mesa: any) => {
        setEditingMesa(mesa);
        setEditNumero(mesa.numero);
        setEditCapacidad(mesa.capacidad);
        setEditDescripcion(mesa.descripcion);
      };

      const [searchTerm, setSearchTerm] = useState("");
      const filteredMesas = mesas.filter((mesa) => {
        const search = searchTerm.toLowerCase();
        const numero = mesa.numero.toString();
        const descripcion = mesa.descripcion.toLowerCase();
        const estado = mesa.estado === 0 ? "libre" : "ocupado";

        return (
          numero.includes(search) ||
          descripcion.includes(search) ||
          estado.includes(search)
        );
      });


    {/*estados */}
    const [editingMesa, setEditingMesa] = useState<any | null>(null);

    const [isCreating, setIsCreating] = useState(false);
    const [editNumero, setEditNumero] = useState<number>(0);
    const [editCapacidad, setEditCapacidad] = useState<number>(0);
    const [editDescripcion, setEditDescripcion] = useState<string>("");

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "info">("success");






  return (
    <div>

        {toastMessage && (
        <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setToastMessage(null)}
        />
        )}


      <h1 className="text-2xl font-raleway font-bold mb-4">Gestión de Mesas</h1>

      <div className="mb-4">
            <input
                type="text"
                placeholder="Buscar mesa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
            />
        </div>

      <table className="min-w-full  font-raleway table-auto bg-white border">



        <thead>
          <tr>
            <th className="py-2">Número</th>
            <th className="py-2">Capacidad</th>
            <th className="py-2">Descripción</th>
            <th className="py-2">Estado</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>



        <tbody>

          {filteredMesas.map((mesa) => (
            <tr className='hover:bg-eggshell-300' key={mesa.id_mesa}>

              <td className="text-center">{mesa.numero}</td>
              <td className="text-center">{mesa.capacidad}</td>
              <td className="text-center">{mesa.descripcion}</td>

              <td className="text-center">
                    {mesa.estado === 0 ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Libre
                        </span>
                    ) : (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Ocupado
                        </span>
                    )}
                </td>


              <td className="flex justify-center gap-2 py-2">
                <button onClick={() => marcarLibre(mesa.id_mesa)} className="px-2 py-1 bg-green-400 rounded-md">Libre</button>
                <button onClick={() => marcarOcupado(mesa.id_mesa)} className="px-2 py-1 bg-red-400 rounded-md">Ocupado</button>
              </td>

              <td className="flex justify-center gap-2 py-2">
                <button  onClick={() => startEditingMesa(mesa)}

                className="px-2 py-1 bg-blue-400 rounded-md hover:bg-blue-500">Modificar</button>
              </td>

            </tr>
          ))}

        </tbody>



      </table>

      <button  onClick={() => setIsCreating(true)} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"> + Agregar una Mesa</button>

      {/*abre formularios */}

        {/*form de creacion */}
        <Dialog open={isCreating} onClose={() => setIsCreating(false)}>

            <DialogContent>

                <DialogHeader><DialogTitle>Crear Nueva Mesa</DialogTitle></DialogHeader>

                <form onSubmit={handleCreateMesa}>

                    <label>Número de Mesa</label>
                    <input
                        type="text"
                        placeholder="Número de Mesa"
                        value={numero}
                        onChange={(e) => setNumero(Number(e.target.value))}
                        className="border p-2 rounded-md w-full mb-2"
                    />

                    <label>Capacidad</label>
                    <input
                        type="text"
                        placeholder="Capacidad"
                        value={capacidad}
                        onChange={(e) => setCapacidad(Number(e.target.value))}
                        className="border p-2 rounded-md w-full mb-2"
                    />

                    <label>Ubicación</label>
                    <input
                        type="text"
                        placeholder="Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="border p-2 rounded-md w-full mb-2"
                    />

                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md">
                        Crear
                    </button>

                </form>

            </DialogContent>

        </Dialog>



        {/*dialog patra editar mesa */}
        <Dialog open={!!editingMesa} onClose={() => setEditingMesa(null)}>

            <DialogContent>

                <DialogHeader><DialogTitle>Editar Mesa</DialogTitle></DialogHeader>

                <form onSubmit={handleUpdateMesa}>

                    <label>Número de Mesa</label>
                    <input
                        type="text"
                        value={editNumero}
                        onChange={(e) => setEditNumero(Number(e.target.value))}
                        className="border p-2 rounded-md w-full mb-2"
                    />

                    <label>Capacidad</label>
                    <input
                        type="text"
                        value={editCapacidad}
                        onChange={(e) => setEditCapacidad(Number(e.target.value))}
                        className="border p-2 rounded-md w-full mb-2"
                    />

                    <label>Ubicación</label>
                    <input
                        type="text"
                        value={editDescripcion}
                        onChange={(e) => setEditDescripcion(e.target.value)}
                        className="border p-2 rounded-md w-full mb-2"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md">
                        Actualizar
                    </button>

                </form>

            </DialogContent>

        </Dialog>



    </div>

  );

};

export default MesasTable;
