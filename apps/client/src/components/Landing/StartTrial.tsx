import { ArrowRight } from "lucide-react";

const StartTrial = () => {
    return (

        <section className="py-25 px-6 bg-eggshell-whitedove animate-slide-in">

            <div className="container mx-auto text-center space-y-10">

                {/* Top content */}
                <div className="max-w-3xl mx-auto space-y-4">

                    <h2 className="text-4xl md:text-4xl font-playfair font-bold text-gray-700">
                    ¿Listo para Transformar la Gestión de tu Restaurante?
                    </h2>

                    <p className="text-lg md:text-base font-raleway text-gray-700">
                    Únete a los miles de restaurantes que ya usan <strong>Pora</strong> para optimizar sus operaciones y mejorar la experiencia de sus clientes.
                    </p>

                </div>

                {/* Botones */}
                <div className="flex flex-col md:flex-row font-urbanist justify-center items-center gap-6">

                    <button className="bg-blood-100 hover:bg-blood-400 text-eggshell-whitedove font-semibold px-8 py-3 rounded-md flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:-translate-y-1">
                        Empezar Prueba Gratis <ArrowRight size={16} />
                    </button>

                    <button className="bg-transparent text-blood-500 border border-blood-500 font-semibold px-8 py-3 rounded-md hover:bg-blood-100 hover:text-eggshell-whitedove transition-all duration-300 shadow-md hover:-translate-y-1">
                        Adquirir Demo
                    </button>

                </div>

            </div>

        </section>


    );

};

export default StartTrial