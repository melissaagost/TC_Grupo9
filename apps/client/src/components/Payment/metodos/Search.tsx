import { useState } from "react";
import { SearchIcon } from "lucide-react";


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
    <div className="relative mb-6 w-full max-w-md">
      <SearchIcon className="absolute left-3 top-1/3 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Buscar método..."
        value={searchTerm}
        onChange={handleChange}
        className="md:w-90 pl-10 lg:w-102 border bg-white border-gray-300 rounded-xl p-2 w-full mb-6 focus:outline-none"
      />
    </div>
  );
};



export default Search;
