import { FlatList, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PalabraFila from '../../components/PalabraFila';
import { useGuardado } from '../../lib/guardado';
import { palabras } from '../../lib/palabras';
import { comun } from '../../lib/theme';

export default function Favoritos() {
  const insets = useSafeAreaInsets();
  const { favoritos } = useGuardado();
  const lista = palabras.filter((p) => favoritos.includes(p.id));

  return (
    <FlatList
      style={comun.fondo}
      data={lista}
      keyExtractor={(p) => p.id}
      renderItem={({ item }) => <PalabraFila p={item} />}
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 16 }}
      ListHeaderComponent={<Text style={[comun.titulo, { marginBottom: 16 }]}>Favoritos</Text>}
      ListEmptyComponent={<Text style={comun.texto}>Toca el corazón en una palabra para guardarla aquí.</Text>}
    />
  );
}
