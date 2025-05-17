import { Input } from "../UI/Input";
import { Label } from "../UI/Label";
import { Button } from "../UI/Button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import userService from '../../services/userService';
import Toast  from '../UI/Toast'
import pfp from '../../assets/pfp.svg'

const EditProfileC = () => {

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");


    useEffect(() => {
      const fetchData = async () => {
        const token = localStorage.getItem("token") || "";
        const data = await userService.getProfile(token);
        setNombre(data.nombre);
        setCorreo(data.correo);
      };
      fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const token = localStorage.getItem("token") || "";

        if (!nombre.trim() || !correo.trim()) {
          setToastMessage("Nombre y correo no pueden estar vacíos");
          setToastType("error");
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
          setToastMessage("El correo no tiene un formato válido");
          setToastType("error");
          return;
        }
        //msj de confirmacion y deslogueo
      try {
        await userService.updateOwnProfile({ nombre, correo }, token);

        setToastMessage("Perfil actualizado");
        setToastType("success");

      } catch (err) {

        setToastMessage("Error al actualizar");
        setToastType("error");

      }
    };


  return (

    <section className="bg-eggshell-whitedove font-raleway border-bg-eggshell-creamy bcontainer mx-auto py-8 px-4">

      {toastMessage && (
        <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setToastMessage(null)}
        />
      )}

      <div className="max-w-2xl mx-auto">

        <div className="bg-white rounded-lg border-1 animate-fade-in border-eggshell-creamy shadow-md p-8 space-y-8">

          {/* Foto de perfil */}
          <div className="flex justify-center">
            <div className="h-30 w-30 rounded-full overflow-hidden">
              <img
                src={pfp}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-center">Editar Perfil</h1>

          {/* Formulario */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Nombre */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Nombre"
                className="bg-pink-100"
                value={nombre} onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                className="bg-pink-100"
                placeholder="email@ejemplo.com"
                value={correo} onChange={(e) => setCorreo(e.target.value)}
              />
            </div>



            {/* Botones */}
            <div className="flex justify-end gap-4 pt-4">

              <Button  type="button">
                <Link  to="/profile">
                    Cancelar
                </Link>
              </Button>

              <Button type="submit">
                Guardar Cambios
              </Button>

            </div>

          </form>

        </div>

      </div>

    </section>

  );

};

export default EditProfileC;
