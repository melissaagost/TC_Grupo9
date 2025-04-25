import { FlameIcon, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal px-6 py-12 text-cream">

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo & Description */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-playfair font-bold text-cream">FoodTable</span>
            <span className="text-xl font-playfair text-gold">Pro</span>
          </div>

          <p className="text-cream max-w-md text-sm">
            Elevate your restaurant management with our comprehensive platform for table reservations, menu management, and user administration.
          </p>

          <div className="flex gap-4 pt-2 text-gold">
            <a href="#"><Instagram size={20} /></a>
            <a href="#"><Facebook size={20} /></a>
            <a href="#"><Twitter size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-playfair font-semibold mb-4 text-cream">Quick Links</h4>
          <ul className="space-y-2 text-cream">
            <li><a href="#" className="hover:text-gold transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-gold transition-colors">Reservations</a></li>
            <li><a href="#" className="hover:text-gold transition-colors">Menu Management</a></li>
            <li><a href="#" className="hover:text-gold transition-colors">User Management</a></li>
            <li><a href="#" className="hover:text-gold transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-gold transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-playfair font-semibold mb-4 text-cream">Contact Us</h4>
          <ul className="space-y-4 text-cream text-sm">
            <li className="flex gap-3 items-start">
              <MapPin className="text-gold mt-1" size={18} />
              <span>123 Restaurant Ave, Culinary District, FD 12345</span>
            </li>
            <li className="flex gap-3 items-center">
              <Phone className="text-gold" size={18} />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex gap-3 items-center">
              <Mail className="text-gold" size={18} />
              <span>support@foodtablepro.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-600 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-cream">
        <p>&copy; {currentYear} FoodTable Pro. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
