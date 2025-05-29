import { AbstractBackendClient } from "./AbstractBackendClient";

export abstract class BackendClient<RequestType, ResponseType> extends AbstractBackendClient<RequestType, ResponseType> {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getAll(): Promise<ResponseType[]> {
    const response = await fetch(`${this.baseUrl}`);
    const data = await response.json();
    return data as ResponseType[];
  }

  async getById(id: number): Promise<ResponseType | null> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as ResponseType;
  }

  async post(data: RequestType): Promise<ResponseType> {
    const response = await fetch(`${this.baseUrl}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const newData = await response.json();
    return newData as ResponseType;
  }

  async patch(id: number | string, data: RequestType): Promise<ResponseType> {
    const response = await fetch(`${this.baseUrl}/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const newData = await response.json();
    return newData as ResponseType;
  }

  // Metodo para actualizar el estado
  async updateEstado(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/actualizar-estado/${id}`, {
      method: "PUT",
    });
    if (!response.ok) {
      throw new Error(`Error al actualizar el estadod el elemento con ID ${id}`);
    }
  }

  // Método para eliminar un elemento por su ID
  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/delete/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar el elemento con ID ${id}`);
    }
  }
}
