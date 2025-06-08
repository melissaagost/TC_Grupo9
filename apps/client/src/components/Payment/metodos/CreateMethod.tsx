//usa methdods form
import { useState } from "react";
import {Dialog} from "../../../components/UI/Dialog";
import { usePaymentLogic } from "../../../hooks/usePaymentLogic";
import MethodsForm from "./MethodsForm";
import { MetodoPagoGuardarDTO } from "../../../types/paymentTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: MetodoPagoGuardarDTO) => void;
}
const CreateMethod = ({ open, onClose, onCreate }: Props) => (
  <Dialog open={open} onClose={onClose}>
    <h2 className="text-lg font-semibold mb-4">Crear método de pago</h2>
    <MethodsForm mode="create" onSubmit={onCreate} />
  </Dialog>
);

export default CreateMethod;