import axiosInstance from "./axiosInstance";

import {
  CategoriaDTO,
  CategoriaCrearDTO,
  CategoriaActualizarDTO,
} from "../types/categoryTypes";

const API_URL = "/categories";

export const categoryService = {
  getAll: async (): Promise<CategoriaDTO[]> => {
    const res = await axiosInstance.get(API_URL);
    return res.data;
  },

  getById: async (id: number): Promise<CategoriaDTO> => {
    const res = await axiosInstance.get(`${API_URL}/${id}`);
    return res.data;
  },

  create: async (data: CategoriaCrearDTO): Promise<CategoriaDTO> => {
    const res = await axiosInstance.post(API_URL, data);
    return res.data;
  },

  update: async (
    id: number,
    data: CategoriaActualizarDTO
  ): Promise<CategoriaDTO> => {
    const res = await axiosInstance.patch(`${API_URL}/${id}/update`, data);
    return res.data;
  },

  disable: async (id: number): Promise<void> => {
    await axiosInstance.patch(`${API_URL}/${id}/disable`);
  },

  enable: async (id: number): Promise<void> => {
  await axiosInstance.patch(`/categories/${id}/enable`);
}
};