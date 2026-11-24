import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Boton from '../../components/Boton';
import { nivel, useGuardado } from '../../lib/guardado';
import { mezclar, palabras, type Palabra } from '../../lib/palabras';
import { colors, comun, fonts } from '../../lib/theme';

const TOTAL = 10;
const PUNTOS_POR_ACIERTO = 10;

type Pregunta = { palabra: Palabra; opciones: string[] };

// 10 palabras al azar; cada una con su significado y 3 significados de otras palabras
function crearPreguntas(): Pregunta[] {
  return mezclar(palabras)
    .slice(0, TOTAL)
    .map((p) => {
      const otros = mezclar(palabras.filter((o) => o.id !== p.id)).slice(0, 3);
      const opciones = mezclar([p.significado, ...otros.map((o) => o.significado)]);
      return { palabra: p, opciones };
    });
}

export default function Quiz() {
  const insets = useSafeAreaInsets();
  const { puntos, sumarPuntos } = useGuardado();
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [indice, setIndice] = useState(0);
  const [elegida, setElegida] = useState<string | null>(null);
  const [aciertos, setAciertos] = useState(0);

  function empezar() {
    setPreguntas(crearPreguntas());
    setIndice(0);
    setElegida(null);
    setAciertos(0);
  }

  function responder(opcion: string) {
    setElegida(opcion);
    if (opcion === preguntas[indice].palabra.significado) {
      setAciertos(aciertos + 1);
      sumarPuntos(PUNTOS_POR_ACIERTO);
    }
  }

  function siguiente() {
    setIndice(indice + 1);
    setElegida(null);
  }

  const pantalla = [comun.fondo, styles.pantalla, { paddingTop: insets.top + 24 }];

  // 1. Inicio: todavía no hay preguntas
  if (preguntas.length === 0) {
    return (
      <View style={pantalla}>
        <Text style={comun.titulo}>¿Qué tan chilango eres?</Text>
        <Text style={comun.texto}>{TOTAL} preguntas. Cada respuesta correcta vale {PUNTOS_POR_ACIERTO} puntos.</Text>
        <Text style={styles.nivel}>{nivel(puntos)} · {puntos} puntos</Text>
        <Boton texto="Empezar" onPress={empezar} />
      </View>
    );
  }

  // 2. Resultado: ya se contestaron todas
  if (indice === TOTAL) {
    const nivelAntes = nivel(puntos - aciertos * PUNTOS_POR_ACIERTO);
    const subio = nivelAntes !== nivel(puntos);
    return (
      <View style={pantalla}>
        <Text style={styles.resultado}>{aciertos}/{TOTAL}</Text>
        <Text style={styles.nivel}>+{aciertos * PUNTOS_POR_ACIERTO} puntos</Text>
        <Text style={comun.texto}>{subio ? `¡Subiste a ${nivel(puntos)}!` : `Nivel: ${nivel(puntos)}`}</Text>
        <Boton texto="Volver a jugar" onPress={empezar} />
      </View>
    );
  }

  // 3. Pregunta
  const pregunta = preguntas[indice];
  const correcta = pregunta.palabra.significado;

  return (
    <ScrollView style={comun.fondo} contentContainerStyle={{ padding: 20, paddingTop: insets.top + 16, gap: 10 }}>
      <View style={styles.cabecera}>
        <Pressable onPress={() => setPreguntas([])} accessibilityLabel="Salir del quiz">
          <Ionicons name="close" size={24} color={colors.navy} />
        </Pressable>
        <Text style={styles.progreso}>Pregunta {indice + 1} de {TOTAL}</Text>
      </View>

      <Text style={comun.texto}>¿Qué significa…</Text>
      <Text style={comun.titulo}>{pregunta.palabra.palabra}</Text>

      {pregunta.opciones.map((opcion) => {
        const verde = elegida !== null && opcion === correcta;
        const roja = opcion === elegida && opcion !== correcta;
        return (
          <Pressable
            key={opcion}
            style={[styles.opcion, verde && { backgroundColor: colors.navy }, roja && { backgroundColor: colors.red }]}
            onPress={() => responder(opcion)}
            disabled={elegida !== null}
          >
            <Text style={[styles.opcionTexto, (verde || roja) && { color: colors.card }]}>{opcion}</Text>
          </Pressable>
        );
      })}

      {elegida !== null && (
        <>
          <Text style={styles.nivel}>{elegida === correcta ? `¡Correcto! +${PUNTOS_POR_ACIERTO}` : 'Casi…'}</Text>
          <Text style={comun.texto}>«{pregunta.palabra.ejemplo}»</Text>
          <Boton texto={indice + 1 === TOTAL ? 'Ver resultado' : 'Siguiente'} onPress={siguiente} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { padding: 20, gap: 16 },
  nivel: { fontFamily: fonts.negrita, fontSize: 18, color: colors.navy },
  resultado: { fontFamily: fonts.titulo, fontSize: 96, lineHeight: 104, color: colors.red },
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  progreso: { fontFamily: fonts.negrita, fontSize: 14, color: colors.navy },
  opcion: { backgroundColor: colors.card, borderRadius: 14, padding: 16 },
  opcionTexto: { fontFamily: fonts.negrita, fontSize: 15, lineHeight: 21, color: colors.navy },
});
