import FeatureCard from "./FeatureCard";

const Features = () =>{
    return(

    <section className="py-20 px-6 bg-eggshell-whitedove">

        <div className="container mx-auto text-center space-y-8">

            {/* Top content */}
            <div className="max-w-5xl mx-auto space-y-4">
                <h2 className="md:whitespace-nowrap text-4xl font-playfair font-bold text-gray-700">
                    Gestión Integral de Restaurantes
                </h2>
                <p className="text-base font-raleway text-gray-700">
                    Nuestra plataforma ofrece todo lo que necesitas para gestionar de manera eficiente las operaciones de tu restaurante.
                </p>
            </div>

            {/* Bottom content (Cards) */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard
                    icon="calendar"
                    title="Reserva de Mesas"
                    description="Gestiona de manera eficiente las reservas de mesas y optimiza la capacidad de asientos de tu restaurante."
                    color="bg-blood-100"
                />
                <FeatureCard
                    icon="book"
                    title="Gestión del Menú"
                    description="Actualiza y organiza fácilmente los ítems del menú, las categorías y los precios de tu restaurante."
                    color="bg-gold-mustard"
                />
                <FeatureCard
                    icon="user"
                    title="Gestión de Usuarios"
                    description="Lleva un control de los clientes, el personal y las cuentas de administradores con una gestión de usuarios integral."
                    color="bg-blood-100"
                />
            </div>

        </div>

    </section>

    );
};

export default Features