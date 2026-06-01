import { environment } from "../environments/environment.development";

const baseUrl = environment.apiUrl;

export const API_ENDPOINTS = {

  products: {
    getAll:        `${baseUrl}/product`,           // GET with query params
    getById:       (id: number) => `${baseUrl}/product/${id}`,
    getStock:   (id: number) => `${baseUrl}/product/${id}/stock`,
  },
  categories: {
    getAll:        `${baseUrl}/category`,
    getById:       (id: number) => `${baseUrl}/category/${id}`,
  }

};