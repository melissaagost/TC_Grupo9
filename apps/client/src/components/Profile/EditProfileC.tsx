import { Input } from "../UI/Input";
import { Label } from "../UI/Label";
import { Button } from "../UI/Button";
import { Link } from "react-router-dom";

const EditProfileC = () => {
  const mockUserData = {
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    profileImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };

  return (

    <section className="bg-eggshell-whitedove font-raleway border-bg-eggshell-creamy bcontainer mx-auto py-8 px-4">

      <div className="max-w-2xl mx-auto">

        <div className="bg-white rounded-lg border-1 animate-fade-in border-eggshell-creamy shadow-md p-8 space-y-8">

          {/* Foto de perfil */}
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full overflow-hidden">
              <img
                src={mockUserData.profileImage}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-center">Editar Perfil</h1>

          {/* Formulario */}
          <form className="space-y-6">
            {/* Nombre */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Nombre"
                className="bg-pink-100"
                defaultValue={mockUserData.name}
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
                defaultValue={mockUserData.email}
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
