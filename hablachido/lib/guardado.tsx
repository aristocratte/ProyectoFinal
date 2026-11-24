// Todo lo que la app guarda en el teléfono: favoritos, puntos y racha de días.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Guardado = {
  favoritos: string[];
  puntos: number;
  racha: number;
  alternarFavorito: (id: string) => void;
  sumarPuntos: (cuantos: number) => void;
};

const Contexto = createContext({} as Guardado);

export const useGuardado = () => useContext(Contexto);

// 10 puntos por cada respuesta correcta en el quiz
export function nivel(puntos: number) {
  if (puntos >= 600) return 'Chilango de cepa';
  if (puntos >= 300) return 'Chilango';
  if (puntos >= 100) return 'Foráneo';
  return 'Turista';
}

// Días seguidos que la persona abre la app
async function actualizarRacha() {
  const hoy = new Date().toDateString();
  const ayer = new Date(Date.now() - 86400000).toDateString();
  const texto = await AsyncStorage.getItem('racha');
  let dias = 1;
  if (texto) {
    const guardada = JSON.parse(texto);
    if (guardada.fecha === hoy) dias = guardada.dias;
    if (guardada.fecha === ayer) dias = guardada.dias + 1;
  }
  await AsyncStorage.setItem('racha', JSON.stringify({ fecha: hoy, dias }));
  return dias;
}

export function GuardadoProvider({ children }: { children: ReactNode }) {
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [puntos, setPuntos] = useState(0);
  const [racha, setRacha] = useState(1);

  // Al abrir la app, leemos lo guardado
  useEffect(() => {
    async function cargar() {
      const favoritosGuardados = await AsyncStorage.getItem('favoritos');
      if (favoritosGuardados) setFavoritos(JSON.parse(favoritosGuardados));
      const puntosGuardados = await AsyncStorage.getItem('puntos');
      if (puntosGuardados) setPuntos(Number(puntosGuardados));
      setRacha(await actualizarRacha());
    }
    cargar();
  }, []);

  function alternarFavorito(id: string) {
    const nuevos = favoritos.includes(id) ? favoritos.filter((x) => x !== id) : [...favoritos, id];
    setFavoritos(nuevos);
    AsyncStorage.setItem('favoritos', JSON.stringify(nuevos));
  }

  function sumarPuntos(cuantos: number) {
    const nuevos = puntos + cuantos;
    setPuntos(nuevos);
    AsyncStorage.setItem('puntos', String(nuevos));
  }

  return (
    <Contexto.Provider value={{ favoritos, puntos, racha, alternarFavorito, sumarPuntos }}>
      {children}
    </Contexto.Provider>
  );
}
