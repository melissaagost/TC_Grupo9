const ReservationCard = () => {
    return (
        <div className="bg-white backdrop-blur-md rounded-lg p-6 text-white w-full max-w-md">

        <h3 className="text-2xl font-playfair text-eggshell-100 font-semibold mb-4">Make a Reservation</h3>

        <form className="space-y-4">

          <div>
            <label className="block mb-1">Date</label>
            <input type="date" className="w-full px-4 py-2 rounded bg-white bg-opacity-80 text-gray-900" />
          </div>

          <div>
            <label className="block mb-1">Time</label>
            <select className="w-full px-4 py-2 rounded bg-white bg-opacity-80 text-gray-900">
              <option>7:00 PM</option>
              <option>7:30 PM</option>
              <option>8:00 PM</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Number of Guests</label>
            <select className="w-full px-4 py-2 rounded bg-white bg-opacity-80 text-gray-900">
              <option>2 Guests</option>
              <option>4 Guests</option>
              <option>6 Guests</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-gold-200  hover:bg-gold-golden text-gray-900 font-semibold w-full py-2 rounded transition-colors">
            Find a Table
          </button>

        </form>

      </div>
    );
};

export default ReservationCard