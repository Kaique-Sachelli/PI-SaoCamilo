//troque pelo IP do computador que roda o backend (server.js).
<<<<<<< HEAD
export const API_URL = `http://192.168.15.129:3000`;
=======
export const API_URL = `http://192.168.0.14:3000`;
>>>>>>> Funcao-Adm

export function getUrl(rota: string): string {
  const rotaNormalizada = rota.startsWith('/') ? rota : `/${rota}`;
  return `${API_URL}${rotaNormalizada}`;
}