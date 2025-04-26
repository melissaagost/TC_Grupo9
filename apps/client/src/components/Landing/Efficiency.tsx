import EfficiencyCard from './EfficiencyCard'

const Efficiency = () => {

    return (

        <section className='animate-slide-in'>


            <div className="bg-blood-100 py-16 px-40 bg-gradient-to-l from-black/50 via-black/10 to-black/0">

                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-12">

                    {/*Benefits */}
                    <div className="text-eggshell-whitedove max-w-xl space-y-6 ml-4">

                        <h3 className="md:whitespace-nowrap text-4xl  font-playfair font-bold leading-tight">
                            Potencia la Eficiencia de tu Restaurante
                        </h3>

                        <p className="text-md font-raleway">
                            Nuestra plataforma ayuda a restaurantes de todos los tamaños a optimizar operaciones, mejorar la experiencia del cliente y aumentar los ingresos.
                        </p>

                        <ul className="space-y-4 mt-6 text-md font-raleway text-eggshell-whitedove">
                            <li  className="pl-8 bg-[url('/check.svg')] bg-no-repeat bg-left bg-[length:1.25rem]">
                                Aumenta la rotación de mesas en un 25%
                            </li>
                            <li className="pl-8 bg-[url('/check.svg')] bg-no-repeat bg-left bg-[length:1.25rem]">
                                Reduce ausencias con recordatorios automáticos
                            </li>
                            <li className="pl-8 bg-[url('/check.svg')] bg-no-repeat bg-left bg-[length:1.25rem]">
                                Optimiza la programación del personal
                            </li>
                            <li className="pl-8 bg-[url('/check.svg')] bg-no-repeat bg-left bg-[length:1.25rem]">
                                Mejora la toma de decisiones con analíticas
                            </li>
                            <li className="pl-8 bg-[url('/check.svg')] bg-no-repeat bg-left bg-[length:1.25rem]">
                                Ofrece un servicio personalizado al cliente
                            </li>
                        </ul>

                        <button className="mt-8 bg-gold-mustard hover:bg-gold-after font-raleway text-gray-900 font-semibold py-3 px-6 rounded-md transition-colors">
                            Explorar todas las Funcionalidades
                        </button>

                    </div>

                    {/*Pictures */}
                    <EfficiencyCard/>

                </div>


            </div>




        </section>

    );

};

export default Efficiency