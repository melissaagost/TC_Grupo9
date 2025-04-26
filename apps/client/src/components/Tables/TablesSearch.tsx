import { Input } from "../UI/Input";

interface TablesSearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const TablesSearch = ({ searchQuery, setSearchQuery }: TablesSearchProps) => {
  return (
    <Input
      placeholder="Buscar mesas..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="max-w-sm font-raleway bg-pink-100"
    />
  );
};

export default TablesSearch;
