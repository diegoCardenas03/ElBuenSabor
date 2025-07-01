// Clase abstracta que define métodos para operaciones CRUD en un servicio genérico
export abstract class AbstractBackendClient<RequestType, ResponseType> {
  protected baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  abstract getAll(token?: string): Promise<ResponseType[]>;

  abstract getById(id: number, token?: string): Promise<ResponseType | null>;

  abstract getByAuth0Id(id: string, token?: string): Promise<ResponseType | null>;

  abstract post(data: RequestType, token?: string): Promise<ResponseType>;
  abstract put(id: number, data: RequestType, token?: string): Promise<ResponseType>;

  abstract putByAuth0Id(id: string, data: RequestType, token?: string): Promise<ResponseType>;

  // Método abstracto para eliminar un elemento por su ID
  abstract delete(id: number, token?: string): Promise<void>;

  abstract deletePhysical(id: number, token?: string): Promise<void>;

  abstract deletePhysicalByAuth0Id(id: string, token?: string): Promise<void>;
}