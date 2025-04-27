import {
  Table as TableWrapper,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
} from "../UI/Table";
import TableRowComponent from "./TableRow";
import { Table } from "./types";

interface TablesListProps {
  tables: Table[];
  handleDelete: (id: number) => void;
  editingTable: Table | null;
  setEditingTable: (table: Table) => void;
  handleUpdate: () => void;
}

const TablesList = ({
  tables,
  handleDelete,
  editingTable,
  setEditingTable,
  handleUpdate,
}: TablesListProps) => {

  return (

    <div className="bg-white rounded-lg font-raleway shadow mt-6">

      <TableWrapper>

        <TableHeader>

          <TableRow>

            <TableHead>Número de Mesa</TableHead>
            <TableHead>Capacidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>

          </TableRow>

        </TableHeader>

          <TableBody>

            {tables.map((table) => (
              <TableRowComponent
                key={table.id}
                table={table}
                onDelete={handleDelete}
                onEdit={(table) => setEditingTable({ ...table, status: table.status as Table["status"] })}
              />
            ))}

          </TableBody>

      </TableWrapper>

    </div>

  );

};

export default TablesList;
