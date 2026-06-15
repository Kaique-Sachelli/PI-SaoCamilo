//troque pelo IP do computador que roda o backend (server.js).
const IP_DO_COMPUTADOR = '192.168.0.200';
const PORTA = 3000;

export const API_URL = `http://192.168.0.200:3000`;

export function getUrl(rota: string): string {
  const rotaNormalizada = rota.startsWith('/') ? rota : `/${rota}`;
  return `${API_URL}${rotaNormalizada}`;
}