
import axiosInstance from "./axiosInstance";
import { ItemGuardarDTO, ItemRowDTO, Paginado } from "../types/itemTypes";

export const itemService = {
  listarItems: async (params?: any): Promise<Paginado<ItemRowDTO>> => {
    const response = await axiosInstance.get("/item/listar", { params });
    return response.data;
  },

  buscarPorId: async (id: number): Promise<ItemRowDTO> => {
    const response = await axiosInstance.get(`/item/buscar/${id}`);
    return response.data;
  },

  guardar: async (data: ItemGuardarDTO) => {
    const response = await axiosInstance.post(`/item/guardar`, data);
    return response.data;
  },

  deshabilitar: async (id: number) => {
    const response = await axiosInstance.patch(`/item/deshabilitar/${id}`);
    return response.data;
  }
};

