import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Boton from '../../components/Boton';
import { useGuardado } from '../../lib/guardado';
import { buscarPorId, consejo } from '../../lib/palabras';
import { colors, comun, fonts } from '../../lib/theme';

// Lee el texto en voz alta con la voz mexicana del teléfono
function escuchar(texto: string) {
  Speech.stop();
  Speech.speak(texto, { language: 'es-MX' });
}

// Si no hay pantalla anterior (por ejemplo, un enlace directo), vamos al inicio
function volver() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

export default function Ficha() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { favoritos, alternarFavorito } = useGuardado();
  const insets = useSafeAreaInsets();
  const p = buscarPorId(id);

  if (!p) return <Text style={[comun.texto, { padding: 40 }]}>No encontramos esta palabra.</Text>;

  const esFavorito = favoritos.includes(p.id);

  return (
    <ScrollView style={comun.fondo} contentContainerStyle={{ padding: 20, paddingTop: insets.top + 12, gap: 12 }}>
      <Pressable style={styles.circulo} onPress={volver} accessibilityLabel="Volver">
        <Ionicons name="arrow-back" size={20} color={colors.navy} />
      </Pressable>

      <Text style={styles.palabra}>{p.palabra}</Text>
      <Text style={styles.significado}>{p.significado}</Text>
      <Text style={[styles.consejo, p.registro === 'vulgar' && { color: colors.red }]}>{consejo[p.registro]}</Text>
      <Text style={comun.texto}>FR · {p.fr}</Text>
      <Text style={comun.texto}>EN · {p.en}</Text>

      <View style={styles.ejemplo}>
        <View style={styles.fila}>
          <Text style={styles.ejemploTexto}>«{p.ejemplo}»</Text>
          <Pressable onPress={() => escuchar(p.ejemplo)} accessibilityLabel="Escuchar el ejemplo">
            <Ionicons name="volume-high" size={22} color={colors.red} />
          </Pressable>
        </View>
        <Text style={comun.texto}>FR · {p.ejemploFr}</Text>
        <Text style={comun.texto}>EN · {p.ejemploEn}</Text>
      </View>

      <View style={styles.fila}>
        <View style={{ flex: 1 }}>
          <Boton texto="Escuchar" onPress={() => escuchar(p.palabra)} />
        </View>
        <Pressable
          style={styles.favorito}
          onPress={() => alternarFavorito(p.id)}
          accessibilityLabel={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Ionicons name={esFavorito ? 'heart' : 'heart-outline'} size={24} color={colors.card} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  circulo: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  palabra: { fontFamily: fonts.titulo, fontSize: 52, lineHeight: 58, color: colors.navy, marginTop: 8 },
  significado: { fontFamily: fonts.medio, fontSize: 19, lineHeight: 26, color: colors.navy },
  consejo: { fontFamily: fonts.negrita, fontSize: 14, color: colors.navy },
  ejemplo: { backgroundColor: colors.card, borderRadius: 20, padding: 18, gap: 6, marginVertical: 8 },
  ejemploTexto: { flex: 1, fontFamily: fonts.negrita, fontSize: 17, lineHeight: 24, color: colors.navy },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  favorito: { width: 54, height: 54, borderRadius: 16, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
});
