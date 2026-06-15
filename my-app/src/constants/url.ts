//troque pelo IP do computador que roda o backend (server.js).
export const API_URL = `http://10.2.129.54:3000`;

export function getUrl(rota: string): string {
  const rotaNormalizada = rota.startsWith('/') ? rota : `/${rota}`;
  return `${API_URL}${rotaNormalizada}`;
}