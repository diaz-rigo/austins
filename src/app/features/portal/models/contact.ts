// contact.model.ts
export interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date; // Añadir el campo de fecha de creación
}
