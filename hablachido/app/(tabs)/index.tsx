import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PalabraFila from '../../components/PalabraFila';
import { nivel, useGuardado } from '../../lib/guardado';
import { normalizar, palabraDelDia, palabras, type Registro } from '../../lib/palabras';
import { colors, comun, fonts } from '../../lib/theme';

type Filtro = Registro | 'todo';
const FILTROS: Filtro[] = ['todo', 'amistoso', 'coloquial', 'vulgar'];

export default function Palabras() {
  const insets = useSafeAreaInsets();
  const { puntos, racha } = useGuardado();
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todo');
  const delDia = palabraDelDia();

  const texto = normalizar(busqueda.trim());
  const resultados = palabras
    .filter((p) => filtro === 'todo' || p.registro === filtro)
    .filter((p) => normalizar(p.palabra).includes(texto) || normalizar(p.significado).includes(texto))
    .sort((a, b) => normalizar(a.palabra).localeCompare(normalizar(b.palabra)));

  return (
    <View style={comun.fondo}>
      <FlatList
        data={resultados}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <PalabraFila p={item} />}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20, paddingTop: insets.top + 16 }}
        ListHeaderComponent={
          <View style={styles.cabecera}>
            <View style={styles.fila}>
              <Text style={styles.marca}>
                Habla<Text style={{ color: colors.red }}>Chido</Text>
              </Text>
              <View style={styles.fila}>
                <Ionicons name="flame" size={16} color={colors.red} />
                <Text style={styles.dato}>{racha}</Text>
                <Ionicons name="star" size={16} color={colors.oro} />
                <Text style={styles.dato}>{nivel(puntos)}</Text>
              </View>
            </View>

            <TextInput
              style={styles.buscador}
              placeholder="Buscar palabra..."
              placeholderTextColor={colors.muted}
              value={busqueda}
              onChangeText={setBusqueda}
              autoCorrect={false}
            />

            {texto === '' && filtro === 'todo' && (
              <Pressable style={styles.delDia} onPress={() => router.push(`/palabra/${delDia.id}`)}>
                <Text style={styles.delDiaEtiqueta}>Palabra del día</Text>
                <Text style={styles.delDiaPalabra}>{delDia.palabra}</Text>
                <Text style={styles.delDiaTexto}>{delDia.significado}</Text>
              </Pressable>
            )}

            <View style={styles.filtros}>
              {FILTROS.map((f) => (
                <Pressable key={f} style={[styles.chip, f === filtro && styles.chipActivo]} onPress={() => setFiltro(f)}>
                  <Text style={[styles.chipTexto, f === filtro && { color: colors.card }]}>{f}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={<Text style={comun.texto}>No encontramos esa palabra.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cabecera: { gap: 16, marginBottom: 16 },
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  marca: { fontFamily: fonts.titulo, fontSize: 24, color: colors.navy },
  dato: { fontFamily: fonts.negrita, fontSize: 14, color: colors.navy, marginRight: 8 },
  buscador: { backgroundColor: colors.card, borderRadius: 14, padding: 14, fontFamily: fonts.medio, fontSize: 15, color: colors.navy },
  delDia: { backgroundColor: colors.red, borderRadius: 24, padding: 20, gap: 4 },
  delDiaEtiqueta: { fontFamily: fonts.negrita, fontSize: 13, color: colors.oro },
  delDiaPalabra: { fontFamily: fonts.titulo, fontSize: 44, lineHeight: 50, color: colors.card },
  delDiaTexto: { fontFamily: fonts.medio, fontSize: 15, color: colors.card },
  filtros: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.card },
  chipActivo: { backgroundColor: colors.navy },
  chipTexto: { fontFamily: fonts.negrita, fontSize: 13, color: colors.navy, textTransform: 'capitalize' },
});
