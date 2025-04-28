import { useEffect, useState } from "react";
import { getAllMesas, setMesaLibre, setMesaOcupado, updateMesa, createMesa } from "../../services/tableService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../UI/Dialog";
import Toast from "../UI/Toast";
import { Plus, SquarePen, BookmarkCheck, BookmarkX } from "lucide-react";



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
    <div className="bg-eggshell-whitedove font-raleway flex flex-col lg:px-60 lg:py-15  py-10 px-4">

        {toastMessage && (
        <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setToastMessage(null)}
        />
        )}


      <h1 className="text-4xl  text-blood-100 font-bold mb-4">Gestión de Mesas</h1>
      <h3 className="text-xl  text-gray-700 font-light mb-4">Administra las mesas de tu restaurante</h3>


      <div className="mb-4">

            <input
                type="text"
                placeholder="Buscar mesa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className=" md:w-90 border  bg-white border-gray-300  rounded-xl p-2 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blood-200"
            />
        </div>

      <table className="min-w-full  font-urbanist table-auto bg-white shadow-2xl rounded-2xl">



        <thead>
          <tr className="text-lg">
            <th className="py-2">Número</th>
            <th className="py-2">Capacidad</th>
            <th className="py-2">Descripción</th>
            <th className="py-2">Estado</th>
            <th className="py-2">Acciones</th>
            <th className="py-2">Pedido</th>
          </tr>
        </thead>



        <tbody>


          {filteredMesas.map((mesa) => (
            <tr className='hover:bg-eggshell-300 border-t-1 border-t-gray-300' key={mesa.id_mesa}>

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

              {/*Si la mesa esta libre: renderiza boton agregar pedido */}
              {/*Si la mesa esta ocupada: renderiza boton pagar y boton modif pedido */}


              <td className="font-semibold flex justify-center text-eggshell-whitedove  gap-2 py-2">
                <button onClick={() => marcarLibre(mesa.id_mesa)} className="px-2 py-1 transition-all duration-300 hover:-translate-y-1 shadow-md bg-green-400 hover:text-green-900 gap-1 inline-flex items-center rounded-md"><BookmarkCheck/>Libre</button>
                <button onClick={() => marcarOcupado(mesa.id_mesa)} className="px-2 py-1 transition-all duration-300 hover:-translate-y-1 shadow-md bg-red-400 hover:text-red-800 gap-1 inline-flex items-center rounded-md"><BookmarkX/>Ocupado</button>
              </td>

              <td className="flex font-semibold justify-center  text-eggshell-whitedove gap-2 py-2">
                <button  onClick={() => startEditingMesa(mesa)}
                className="px-2 py-1 bg-blue-400 hover:text-blue-900 gap-1 inline-flex items-center transition-all duration-300 hover:-translate-y-1 shadow-md rounded-md  "><SquarePen/>Modificar</button>
              </td>


              <td className="text-center">

                    {mesa.estado === 0 ? (
                      <button className="px-2 py-1 transition-all text-white duration-300 font-semibold hover:-translate-y-1 shadow-md bg-gold-order hover:text-orange-700 gap-1 inline-flex items-center rounded-md">
                        <Plus/> Agregar Pedido
                      </button>
                    ) : (
                      <div className="gap-1 items-center font-semibold text-white inline-flex">
                      <button className="px-2 py-1 transition-all duration-300 hover:-translate-y-1 shadow-md bg-blood-pay hover:text-blood-300 gap-1 inline-flex items-center rounded-md">
                        Pagar
                      </button>
                      <button className="px-2 py-1 transition-all duration-300 hover:-translate-y-1 shadow-md bg-gold-modify hover:text-gray-200 gap-1 inline-flex items-center rounded-md">
                        Modificar Pedido
                      </button>
                      </div>
                    )}

              </td>

            </tr>
          ))}

        </tbody>



      </table>

      <button  onClick={() => setIsCreating(true)} className="font-semibold transition-all duration-300 hover:-translate-y-1 shadow-md px-4 py-2 m-5 w-50 gap-1 inline-flex items-center bg-green-500 text-white rounded-3xl hover:bg-green-600"> <Plus size={'20'}/> Agregar una Mesa</button>

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
                        className=" border-eggshell-creamy border-1 p-2 bg-pink-100 text-gray-500 rounded-md w-full mt-2 mb-2"
                    />

                    <label>Capacidad</label>
                    <input
                        type="text"
                        placeholder="Capacidad"
                        value={capacidad}
                        onChange={(e) => setCapacidad(Number(e.target.value))}
                        className="border-eggshell-creamy border-1  bg-pink-100 text-gray-500  p-2 rounded-md w-full mt-2 mb-2"
                    />

                    <label>Ubicación</label>
                    <input
                        type="text"
                        placeholder="Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="border-eggshell-creamy border-1 bg-pink-100 text-gray-500  p-2 rounded-md w-full mt-2 mb-2"
                    />

                    <button
                        type="submit"
                        className="transition-all duration-300 hover:-translate-y-1 shadow-md w-full mt-4 rounded-3xl bg-green-500 hover:bg-green-600 text-white font-semibold py-2">
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
                        className=" border-eggshell-creamy border-1 p-2 bg-pink-100 text-gray-500 rounded-md w-full mt-2 mb-2"
                    />

                    <label>Capacidad</label>
                    <input
                        type="text"
                        value={editCapacidad}
                        onChange={(e) => setEditCapacidad(Number(e.target.value))}
                        className=" border-eggshell-creamy border-1 p-2 bg-pink-100 text-gray-500 rounded-md w-full mt-2 mb-2"
                    />

                    <label>Ubicación</label>
                    <input
                        type="text"
                        value={editDescripcion}
                        onChange={(e) => setEditDescripcion(e.target.value)}
                        className=" border-eggshell-creamy border-1 p-2 bg-pink-100 text-gray-500 rounded-md w-full mt-2 mb-2"
                    />

                    <button
                        type="submit"
                        className="transition-all duration-300 hover:-translate-y-1 shadow-md w-full mt-4 rounded-3xl bg-blue-400 hover:text-blue-900 text-white font-semibold py-2">
                        Actualizar
                    </button>

                </form>

            </DialogContent>

        </Dialog>



    </div>

  );

};

export default MesasTable;
