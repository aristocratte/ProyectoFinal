import { StyleSheet } from 'react-native';

export const colors = {
  cream: '#FFF4E0',
  card: '#FFFFFF',
  red: '#C8283A',
  navy: '#1B2A4A',
  oro: '#F2B632',
  muted: '#5E6B85',
};

export const fonts = {
  titulo: 'BricolageGrotesque_800ExtraBold',
  texto: 'DMSans_400Regular',
  medio: 'DMSans_500Medium',
  negrita: 'DMSans_700Bold',
};

// Estilos que se repiten en varias pantallas
export const comun = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: colors.cream },
  titulo: { fontFamily: fonts.titulo, fontSize: 40, lineHeight: 46, color: colors.navy },
  texto: { fontFamily: fonts.texto, fontSize: 16, lineHeight: 23, color: colors.muted },
});
