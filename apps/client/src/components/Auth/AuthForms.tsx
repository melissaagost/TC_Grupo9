import { useState } from "react";
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";
import { Eye, EyeOff } from "lucide-react";

const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="md:w-1/2 p-8 relative overflow-hidden">

      <div className="relative w-full" style={{ height: "500px" }}>

        {/* Login Form */}
        <div
          className={`absolute w-full transition-all duration-500 ease-in-out ${
            isLogin ? "translate-x-0" : "-translate-x-full opacity-0"
          }`}>

          <h2 className="text-3xl font-playfair font-semibold text-gray-700 mb-6">Bienvenido de Vuelta</h2>

          <form className="space-y-4 font-raleway">

            <div>
              <label className="text-sm text-charcoal-600 block mb-1">Email</label>
              <Input className='bg-pink-100 border-eggshell-creamy' type="email" placeholder="Ingresa tu email" />
            </div>

            <div>

              <label className="text-sm text-charcoal-600 block mb-1">Contraseña</label>


              <div className="relative">

                <Input
                  className='bg-pink-100 border-eggshell-creamy'
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600">

                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}

                </button>

              </div>


            </div>

            <Button className="w-full">
              Ingresar
            </Button>

          </form>




          <p className="mt-6 text-center font-raleway text-charcoal-600">
            Nuevo aquí?{" "}

            <button
              onClick={() => setIsLogin(false)}
              className="text-blood-300 hover:underline  font-semibold">
              Registrate
            </button>

          </p>

        </div>






        {/* Register Form */}
        <div
          className={`absolute w-full transition-all duration-500 ease-in-out ${
            !isLogin ? "translate-x-0" : "translate-x-full opacity-0"
          }`}>

          <h2 className="text-3xl font-playfair font-semibold text-gray-700 mb-6">Crea una Cuenta</h2>

          <form className="space-y-4 font-raleway">

            <div>
              <label className="text-sm  text-charcoal-600 block mb-1">Nombre Completo</label>
              <Input className='bg-pink-100 border-eggshell-creamy' type="text" placeholder="Ingresa tu nombre completo" />
            </div>

            <div>
              <label className="text-sm text-charcoal-600 block mb-1">Email</label>
              <Input className='bg-pink-100 border-eggshell-creamy' type="email" placeholder="Ingresa tu email" />
            </div>

            <div>

              <label className="text-sm text-charcoal-600 block mb-1">Contraseña</label>

              <div className="relative">

                <Input
                  className='bg-pink-100 border-eggshell-creamy'
                  type={showPassword ? "text" : "password"}
                  placeholder="Elige una contraseña"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600">

                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>

              </div>

            </div>

            <Button className="w-full">
              Crear Cuenta
            </Button>

          </form>


          <p className="mt-6 text-center font-raleway text-charcoal-600">
            Ya tienes una cuenta?{" "}

            <button
              onClick={() => setIsLogin(true)}
              className="text-blood-300 hover:underline mt-2 font-semibold">
              Ingresa
            </button>

          </p>


        </div>

      </div>

    </div>

  );

};

export default AuthForms;
