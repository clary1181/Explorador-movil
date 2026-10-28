import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ModuloCamara from './componentes/ModuloCamara';
import ModuloUbicacion from './componentes/ModuloUbicacion';
import ModuloBrujula from './componentes/ModuloBrujula';

const secciones = [
  { id: 'camara', etiqueta: 'Cámara' },
  { id: 'ubicacion', etiqueta: 'Ubicación' },
  { id: 'brujula', etiqueta: 'Brújula' },
];

export default function App() {
  const [seccion, setSeccion] = useState('camara');

  return (
    <SafeAreaView style={styles.contenedor}>
      <StatusBar barStyle="light-content" backgroundColor={'#1B0C1A'} />

      <View style={styles.header}>
        <Text style={styles.titulo}>Explorador móvil</Text>
        <Text style={styles.subtitulo}>Cámara, ubicación y brújula</Text>
      </View>

      <View style={styles.seccionnavegacion}>
        {secciones.map((p) => {
          const activa = seccion === p.id;
          return (
            <Pressable key={p.id} style={[styles.boton, activa && styles.botonactivo]} onPress={() => setSeccion(p.id)}>
              <Text style={[styles.textoboton, activa && styles.textobotonactivo]}>{p.etiqueta}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.cuadro}>
        {seccion === 'camara' && <ModuloCamara />}
        {seccion === 'ubicacion' && <ModuloUbicacion />}
        {seccion === 'brujula' && <ModuloBrujula />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: { 
    flex: 1, 
    backgroundColor: '#1B0C1A'
  },
  header: {
    paddingBottom: 14,
    paddingHorizontal: 20,
  },
  titulo: { 
    color: '#FFFFFF',
    fontSize: 32, 
    textAlign: 'center'
  },
  subtitulo: { 
    color: '#D391B0',
    fontSize: 14, 
    textAlign: 'center'
  },
  seccionnavegacion: {
    flexDirection: 'row',
    marginHorizontal: 60,
    padding: 4,
    backgroundColor: '#2D222F',
    borderRadius: 14,
  },
  boton: { 
    flex: 1, 
    alignItems: 'center', 
    borderRadius: 10 
  },
  botonactivo: { 
    backgroundColor: '#722548' 
  },
  textoboton: { 
    color: '#D391B0', 
    fontWeight: '600', 
    fontSize: 13 
  },
  textobotonactivo: { 
    color: '#FFFFFF', 
    fontWeight: '700' 
  },
  cuadro: { 
    flex: 1, 
    marginTop: 14 
  },
});