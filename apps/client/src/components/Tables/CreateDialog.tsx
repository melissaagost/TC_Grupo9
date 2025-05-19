// components/CreateDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../UI/Dialog";
import TableForm from "./TableForm";

interface CreateDialogProps {
  open: boolean;
  numero: number;
  capacidad: number;
  descripcion: string;
  setNumero: (value: number) => void;
  setCapacidad: (value: number) => void;
  setDescripcion: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CreateDialog = ({
  open,
  numero,
  capacidad,
  descripcion,
  setNumero,
  setCapacidad,
  setDescripcion,
  onClose,
  onSubmit,
}: CreateDialogProps) => (
  <Dialog open={open} onClose={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Crear Nueva Mesa</DialogTitle>
      </DialogHeader>
      <TableForm
        numero={numero}
        capacidad={capacidad}
        descripcion={descripcion}
        onNumeroChange={setNumero}
        onCapacidadChange={setCapacidad}
        onDescripcionChange={setDescripcion}
        onCancel={onClose}
        onSubmit={onSubmit}
        submitLabel="Agregar Mesa"
      />
    </DialogContent>
  </Dialog>
);

export default CreateDialog;
