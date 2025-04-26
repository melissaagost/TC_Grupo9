const ReservationCard = () => {
    return (
        <div className="bg-white/15 backdrop-blur-md rounded-lg p-6 border-1 text-eggshell-100 w-full max-w-md mr-4">

          <h3 className="text-2xl font-playfair text-eggshell-100 font-semibold mb-4">Haz una Reserva</h3>

          <form className="space-y-4">

            <div >
              <label className="block mb-1 font-raleway">Día</label>
              <input type="date" className="w-full px-4 py-2 rounded bg-white/25 border-1 border-rose-50 backdrop-blur-md text-rose-50 font-raleway" />
            </div>

            <div>
              <label className="block mb-1 font-raleway">Hora</label>
              <select className="w-full px-4 py-2 rounded  bg-white/25 border-1 border-rose-50 backdrop-blur-md text-rose-50 font-raleway">
                <option className="text-black">7:00 PM</option>
                <option className="text-black">7:30 PM</option>
                <option className="text-black">8:00 PM</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-raleway">Número de Invitados</label>
              <select className="w-full px-4 py-2 rounded  bg-white/25 border-1 border-rose-50 backdrop-blur-md text-rose-50 font-raleway">
                <option className="text-black">2 Invitados</option>
                <option className="text-black">4 Invitados</option>
                <option className="text-black">6 Invitados</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-gold-mustard  font-raleway hover:bg-gold-after text-blood-700 font-semibold w-full py-2 mt-2 rounded-md transition-colors">
              Buscar una Mesa
            </button>

          </form>

      </div>
    );
};

export default ReservationCard