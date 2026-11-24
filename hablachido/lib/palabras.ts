import data from '../data/palabras.json';

// Con quién se puede usar una palabra
export type Registro = 'amistoso' | 'coloquial' | 'vulgar';

export type Palabra = {
  id: string;
  palabra: string;
  significado: string;
  ejemplo: string;
  ejemploFr: string;
  ejemploEn: string;
  registro: Registro;
  fr: string;
  en: string;
};

export const palabras = data as Palabra[];

export const consejo: Record<Registro, string> = {
  amistoso: 'Amistoso: puedes usarla con todos.',
  coloquial: 'Coloquial: con amigos, no en contextos formales.',
  vulgar: 'Vulgar: evítala en contextos formales.',
};

export function buscarPorId(id: string) {
  return palabras.find((p) => p.id === id);
}

// Quita acentos, ¿ ¡ y mayúsculas: "orale" encuentra "¡Órale!"
export function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ¿¡]/g, '').toLowerCase();
}

// Desordena una lista al azar
export function mezclar<T>(lista: T[]): T[] {
  return [...lista].sort(() => Math.random() - 0.5);
}

// Cambia cada día y es la misma para todos
export function palabraDelDia() {
  const hoy = new Date();
  const inicioDelAno = new Date(hoy.getFullYear(), 0, 0);
  const diaDelAno = Math.floor((hoy.getTime() - inicioDelAno.getTime()) / 86400000);
  return palabras[diaDelAno % palabras.length];
}
