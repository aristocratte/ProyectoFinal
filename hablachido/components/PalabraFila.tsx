import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Palabra } from '../lib/palabras';
import { colors, fonts } from '../lib/theme';

// Una palabra de la lista; al tocarla abre su ficha
export default function PalabraFila({ p }: { p: Palabra }) {
  return (
    <Pressable style={styles.fila} onPress={() => router.push(`/palabra/${p.id}`)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.palabra}>{p.palabra}</Text>
        <Text style={styles.significado} numberOfLines={1}>{p.significado}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.red} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 10 },
  palabra: { fontFamily: fonts.negrita, fontSize: 17, color: colors.navy },
  significado: { fontFamily: fonts.texto, fontSize: 13, color: colors.muted, marginTop: 2 },
});
