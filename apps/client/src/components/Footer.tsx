import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

import { useAuth } from "../context/AuthContext";


const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { token, userType } = useAuth();

  return (
    <footer className="bg-gray-charcoal px-6 py-12 text-eggshell-300">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Logo & Description */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-playfair font-bold text-eggshell-whitedove">Pora</span>
            {/*<span className="text-xl font-playfair text-gold-golden">Pro</span>*/}
          </div>

          <p className="text-eggshell-creamy font-raleway max-w-md text-sm">
            Eleva la gestión de tu restaurante con nuestra plataforma integral para reserva de mesas, administración de menú y administración de usuarios.</p>

          <div className="flex gap-4 pt-2 text-eggshell-creamy">
            <a href="https://www.instagram.com/melissa.agost?igsh=MWlhbzBoMzlvd2p3cw=="><Instagram size={20} /></a>
            <a href="#"><Facebook size={20} /></a>
            <a href="https://x.com/melissa_agost?t=v_oZyY6JXZn_R2_2Tmi4cg&s=08"><Twitter size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-2xl font-playfair font-semibold mb-4 text-eggshell-whitedove">Quick Links</h4>
          <ul className="space-y-2 font-raleway text-eggshell-creamy">
            <li><a href="/" className="hover:text-gold-golden transition-colors">Inicio</a></li>

            {token && (
            <>
            <li><a href="/building" className="hover:text-gold-golden transition-colors">Reservas</a></li>
            <li><a href="/building" className="hover:text-gold-golden transition-colors">Gestión de Menú</a></li>

            {userType === 'administrador' &&(
            <li><a href="/building" className="hover:text-gold-golden transition-colors">Gestión de Usuarios</a></li>
            )}

            </>
            )}
            <li><a href="/building" className="hover:text-gold-golden transition-colors">Sobre Nosotros</a></li>
            <li><a href="/building" className="hover:text-gold-golden transition-colors">Contacto</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-2xl font-playfair font-semibold mb-4 text-eggshell-whitedove">Contáctanos</h4>
          <ul className="space-y-4 font-raleway text-eggshell-creamy text-sm">
            <li className="flex gap-3 items-start">
              <MapPin className="text-gold-golden mt-1" size={18} />
              <span>123 Restaurant Ave, Culinary District, FD 12345</span>
            </li>
            <li className="flex gap-3 items-center">
              <Phone className="text-gold-golden" size={18} />
              <span>+54 (379) 4747458</span>
            </li>
            <li className="flex gap-3 items-center">
              <Mail className="text-gold-golden" size={18} />
              <span>soporte@pora.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t font-raleway border-eggshell-300 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-eggshell-creamy">
        <p>&copy; {currentYear} Pora. Todos los Derechos Reservados.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="/building" className="hover:text-gold-golden transition-colors">Política de Privacidad</a>
          <a href="/building" className="hover:text-gold-golden transition-colors">Términos y Condiciones</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
