import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator, ScrollView, Linking } from 'react-native';
import * as Location from 'expo-location';

export default function ModuloUbicacion() {
  const [estadoPermiso, setEstadoPermiso] = useState('pendiente');
  const [ubicacion, setUbicacion] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState(null);

  const alPermitir = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setEstadoPermiso(status === 'granted' ? 'concedido' : 'denegado');
    } catch (error) {
      setEstadoPermiso('denegado');
    }
  };

  const obtenerUbicacion = async () => {
    setCargando(true);
    setMensajeError(null);
    try {
      const posicion = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUbicacion(posicion.coords);
    } catch (error) {
      setMensajeError('No se pudo obtener la ubicación. Revisa que el GPS esté activado y que tengas señal.');
    } finally {
      setCargando(false);
    }
  };

  if (estadoPermiso === 'denegado') {
    return (
      <View style={styles.centro}>
        <Text style={styles.titulo}>Permiso denegado</Text>
        <Text style={styles.texto}>
          Sin el permiso no podemos mostrar tus coordenadas. Puedes activarlo de la siguiente manera:
        </Text>

        <View style={styles.cajaAyuda}>
          <Text style={styles.ayudaTitulo}>Para activarlo:</Text>
          <Text style={styles.ayudaTexto}>1. Abre los Ajustes del teléfono.</Text>
          <Text style={styles.ayudaTexto}>2. Entra a Aplicaciones y busca Expo Go.</Text>
          <Text style={styles.ayudaTexto}>3. Toca Permisos y luego Ubicación.</Text>
          <Text style={styles.ayudaTexto}>4. Elige "Permitir solo mientras se usa la app" y regresa.</Text>

          <Pressable style={styles.botonAjustes} onPress={() => Linking.openSettings()}>
            <Text style={styles.botonTexto}>Abrir ajustes</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (estadoPermiso === 'pendiente') {
    return (
      <View style={styles.centro}>
        <Text style={styles.titulo}>Permiso de ubicación</Text>
        <Text style={styles.texto}>
          Necesitamos tu ubicación para mostrarte tus coordenadas en pantalla.
        </Text>

        <Pressable style={styles.boton} onPress={alPermitir}>
          <Text style={styles.botonTexto}>Permitir</Text>
        </Pressable>

        <Pressable style={styles.botonSecundario} onPress={() => setEstadoPermiso('denegado')}>
          <Text style={styles.botonSecundarioTexto}>No permitir</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.titulo}>Mi ubicación</Text>

      <Pressable
        style={[styles.boton, cargando && { opacity: 0.6 }]}
        onPress={obtenerUbicacion}
        disabled={cargando}
      >
        <Text style={styles.botonTexto}>Obtener mi ubicación</Text>
      </Pressable>

      {cargando && (
        <View style={styles.zonaCarga}>
          <ActivityIndicator size="large" color="#F9AAAD" />
          <Text style={styles.texto}>Obteniendo coordenadas...</Text>
        </View>
      )}

      {mensajeError && (
        <View style={styles.cajaError}>
          <Text style={styles.errorTexto}>{mensajeError}</Text>
        </View>
      )}

      {ubicacion && !cargando && (
        <View style={styles.tarjeta}>
          <Text style={styles.tarjetaTitulo}>Coordenadas obtenidas</Text>

          <Text style={styles.datoNombre}>Latitud</Text>
          <Text style={styles.datoValor}>{ubicacion.latitude.toFixed(6)}°</Text>

          <Text style={styles.datoNombre}>Longitud</Text>
          <Text style={styles.datoValor}>{ubicacion.longitude.toFixed(6)}°</Text>

          <Text style={styles.datoNombre}>Precisión reportada</Text>
          <Text style={styles.datoValor}>
            {ubicacion.accuracy != null ? `${ubicacion.accuracy.toFixed(1)} m` : 'No disponible'}
          </Text>
        </View>
      )}

      {!ubicacion && !cargando && !mensajeError && (
        <Text style={styles.texto}>Pulsa el botón para consultar tu posición actual.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centro: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 24, 
  },
  contenedor: { 
    flexGrow: 1, 
    padding: 20, 
    alignItems: 'center', 
  },
  titulo: { 
    color: '#FFFFFF', 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 10, 
  },
  texto: { 
    color: '#FADCD5', 
    fontSize: 15, 
    textAlign: 'center', 
    marginTop: 8, 
    marginBottom: 12, 
    lineHeight: 21, 
  },
  boton: { 
    backgroundColor: '#722548', 
    paddingVertical: 14, 
    paddingHorizontal: 28, 
    borderRadius: 12, 
    marginBottom: 12, 
  },
  botonTexto: { 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: 16, 
  },
  botonSecundario: { 
    marginTop: 6, 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#5D3C64', 
  },
  botonSecundarioTexto: { 
    color: '#F9AAAD', 
    fontWeight: '600', 
  },
  cajaAyuda: { 
    marginTop: 8, 
    backgroundColor: '#2D222F', 
    borderRadius: 14, 
    padding: 16, 
    width: '100%', 
    borderWidth: 1, 
    borderColor: '#5D3C64', 
  },
  ayudaTitulo: { 
    color: '#F9AAAD', 
    fontWeight: 'bold', 
    fontSize: 15, 
    marginBottom: 8, 
  },
  ayudaTexto: { 
    color: '#FADCD5', 
    fontSize: 14, 
    marginVertical: 2, 
  },
  botonAjustes: { 
    backgroundColor: '#A1525F', 
    paddingVertical: 11, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 12, 
  },
  zonaCarga: { 
    alignItems: 'center', 
    marginTop: 10, 
  },
  cajaError: { 
    backgroundColor: '#541533', 
    borderRadius: 12, 
    padding: 14, 
    width: '100%', 
    borderWidth: 1, 
    borderColor: '#A1525F', 
  },
  errorTexto: { 
    color: '#F9AAAD', 
    textAlign: 'center', 
    lineHeight: 20, 
  },
  tarjeta: { 
    backgroundColor: '#2D222F', 
    borderRadius: 16, 
    padding: 20, 
    width: '100%', 
    borderWidth: 1, 
    borderColor: '#5D3C64', 
  },
  tarjetaTitulo: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 12, 
  },
  datoNombre: { 
    color: '#D391B0', 
    fontSize: 13, 
    marginTop: 8, 
  },
  datoValor: { 
    color: '#F9AAAD', 
    fontSize: 22, 
    fontWeight: 'bold', 
  },
});