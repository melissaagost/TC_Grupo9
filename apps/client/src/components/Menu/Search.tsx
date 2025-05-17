
import { useState } from "react";


interface SearchProps {
  onSearch: (term: string) => void;
}

const Search = ({ onSearch }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <div className="mb-4 font-urbanist">
      <input
        type="text"
        placeholder="Buscar menú..."
        value={searchTerm}
        onChange={handleChange}
        className="md:w-90 lg:w-102 border bg-white border-gray-300 rounded-xl p-2 w-full mb-6 focus:outline-none"
      />
    </div>
  );
};



export default Search;




    //  const filteredUsers = users.filter((user) => {
    //     const name = user.nombre.toLowerCase();
    //     const email = user.correo.toLowerCase();
    //     const term = searchTerm.toLowerCase();

    //     const matchesSearch = name.includes(term) || email.includes(term);
    //     const isInactive = user.estado === 0;

    //     const typeMatch =

    //       userTypeFilter === "all"
    //         ? true
    //         : userTypeFilter === "inactive"
    //         ? isInactive
    //         : user.tipo_usuario?.toLowerCase() === userTypeFilter.toLowerCase();

    //     return matchesSearch && typeMatch;
    //   });
