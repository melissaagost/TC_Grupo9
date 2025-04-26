import { useState } from "react";
import TablesHeader from "../components/Tables/TablesHeader";
import TablesSearch from "../components/Tables/TablesSearch";
import TablesList from "../components/Tables/TablesList";
import { Table, TableStatus } from "../components/Tables/types";


const initialTables: Table[] = [
  { id: 1, number: "1", capacity: 4, location: "Main Floor", status: "available" },
  { id: 2, number: "2", capacity: 2, location: "Window", status: "occupied" },
  { id: 3, number: "3", capacity: 6, location: "Terrace", status: "available" },
  { id: 4, number: "4", capacity: 4, location: "Bar", status: "reserved" },
  { id: 5, number: "5", capacity: 8, location: "Private Room", status: "available" },
];

const Tables = () => {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTable, setEditingTable] = useState<Table | null>(null);

  const handleCreate = (newTable: Omit<Table, "id">) => {
    const id = Math.max(...tables.map((t) => t.id)) + 1; // calcular nuevo ID
    const tableToAdd: Table = { ...newTable, id };
    setTables([...tables, tableToAdd]);
  };


  const handleDelete = (id: number) => {
    setTables(tables.filter((table) => table.id !== id));
  };

  const handleUpdate = () => {
    if (!editingTable) return;
    setTables(tables.map((t) => (t.id === editingTable.id ? editingTable : t)));
    setEditingTable(null);
  };

  const filteredTables = tables.filter(
    (table) =>
      table.number.includes(searchQuery) ||
      table.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (

    <div className="min-h-screen py-6 bg-eggshell-whitedove">

      <div className="container mx-auto ">

        <TablesHeader onCreate={handleCreate} />

        <TablesSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <TablesList
          tables={filteredTables}
          handleDelete={handleDelete}
          editingTable={editingTable}
          setEditingTable={(table) => setEditingTable({ ...table, status: table.status as TableStatus })}
          handleUpdate={handleUpdate}
        />

      </div>

    </div>

  );

};

export default Tables;
