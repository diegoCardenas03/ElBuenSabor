import { AbstractBackendClient } from "./AbstractBackendClient";

export function buildHeaders(token?: string, contentType = "application/json") {
  const headers: Record<string, string> = {};
  if (contentType) headers["Content-Type"] = contentType;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export abstract class BackendClient<RequestType, ResponseType> extends AbstractBackendClient<RequestType, ResponseType> {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getAll(token?: string): Promise<ResponseType[]> {
    const response = await fetch(`${this.baseUrl}`, {
      headers: buildHeaders(token, undefined),
    });
    const data = await response.json();
    return data as ResponseType[];
  }

  async getById(id: number, token?: string): Promise<ResponseType | null> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      headers: buildHeaders(token, undefined),
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as ResponseType;
  }

  async getByEmail(email: string, token?: string): Promise<ResponseType | null> {
    const response = await fetch(`${this.baseUrl}/email/${email}`, {
      headers: buildHeaders(token, undefined),
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as ResponseType;
  }

  async getByAuth0Id(id: string, token?: string): Promise<ResponseType | null> {
    const response = await fetch(`${this.baseUrl}/auth0/${id}`, {
      headers: buildHeaders(token, undefined),
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as ResponseType;
  }

  async post(data: RequestType, token?: string): Promise<ResponseType> {
    const response = await fetch(`${this.baseUrl}/save`, {
      method: "POST",
      headers: buildHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    return "objeto creado" as ResponseType;
  }

  async patch(id: number | string, data: RequestType, token?: string): Promise<ResponseType> {
    const response = await fetch(`${this.baseUrl}/update/${id}`, {
      method: "PUT",
      headers: buildHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    return "objeto actualizado" as ResponseType;
  }

  async put(id: number, data: RequestType, token?: string): Promise<ResponseType> {
    const response = await fetch(`${this.baseUrl}/update/${id}`, {
      method: "PUT",
      headers: buildHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const newData = await response.json();
    return newData as ResponseType;
  }

  async putByAuth0Id(id: string, data: RequestType, token?: string): Promise<ResponseType> {
    const response = await fetch(`${this.baseUrl}/update/auth0/${id}`, {
      method: "PUT",
      headers: buildHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const newData = await response.json();
    return newData as ResponseType;
  }

  async updateEstado(id: number, token?: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/toggle-activo/${id}`, {
      method: "PUT",
      headers: buildHeaders(token, undefined),
    });
    if (!response.ok) {
      throw new Error(`Error al actualizar el estado del elemento con ID ${id}`);
    }
  }

  async delete(id: number, token?: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/delete/${id}`, {
      method: "DELETE",
      headers: buildHeaders(token, undefined),
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar el elemento con ID ${id}`);
    }
  }

  async deletePhysical(id: number, token?: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/delete/physical/${id}`, {
      method: "DELETE",
      headers: buildHeaders(token, undefined),
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar el elemento con ID ${id}`);
    }
  }

  async deletePhysicalByAuth0Id(id: string, token?: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/delete/physical/auth0/${id}`, {
      method: "DELETE",
      headers: buildHeaders(token, undefined),
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar el elemento con ID ${id}`);
    }
  }
}

