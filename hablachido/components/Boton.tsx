import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../lib/theme';

// Botón rojo grande que usamos en varias pantallas
export default function Boton({ texto, onPress }: { texto: string; onPress: () => void }) {
  return (
    <Pressable style={styles.boton} onPress={onPress}>
      <Text style={styles.texto}>{texto}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: { height: 54, borderRadius: 16, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  texto: { fontFamily: fonts.negrita, fontSize: 16, color: colors.card },
});
