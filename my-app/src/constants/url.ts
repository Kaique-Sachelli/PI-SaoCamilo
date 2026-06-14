//troque pelo IP do computador que roda o backend (server.js).
const IP_DO_COMPUTADOR = '192.168.15.32';
const PORTA = 3000;

export const API_URL = `http://${IP_DO_COMPUTADOR}:${PORTA}`;

export function getUrl(rota: string): string {
  const rotaNormalizada = rota.startsWith('/') ? rota : `/${rota}`;
  return `${API_URL}${rotaNormalizada}`;
}