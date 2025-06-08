import {Dialog, DialogHeader, DialogTitle} from "../../../components/UI/Dialog";
import MethodsForm from "./MethodsForm";
import { MetodoPagoGuardarDTO } from "../../../types/paymentTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: MetodoPagoGuardarDTO) => void;
  onToast: (message: string, type: "success" | "error" | "info") => void;

}
const CreateMethod = ({ open, onClose, onCreate, onToast }: Props) => (
  <Dialog open={open} onClose={onClose}>
     <DialogHeader>
        <DialogTitle>Agregar Método de Pago</DialogTitle>
      </DialogHeader>
    <MethodsForm mode="create" onSubmit={onCreate} onToast={onToast} />
  </Dialog>
);

export default CreateMethod;