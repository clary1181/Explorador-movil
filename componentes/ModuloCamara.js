import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, Pressable, ActivityIndicator, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function ModuloCamara() {
  const [permiso, pedirPermiso] = useCameraPermissions();
  const [fotoTomada, setFotoTomada] = useState(null);
  const [camaraLista, setCamaraLista] = useState(false);
  const [tomandoFoto, setTomandoFoto] = useState(false);
  const [permisoNegado, setPermisoNegado] = useState(false);
  const camaraRef = useRef(null);

  const alPermitir = async () => {
    const respuesta = await pedirPermiso();
    if (!respuesta.granted) {
      setPermisoNegado(true);
    }
  };

  if (!permiso) {
    return;
  }

  if (!permiso.granted) {
    if (permisoNegado) {
      return (
        <View style={styles.centro}>
          <Text style={styles.titulo}>Permiso denegado</Text>
          <Text style={styles.texto}>
            Sin el permiso no podemos usar la cámara. Puedes activarlo de la siguiente manera:
          </Text>

          <View style={styles.ayuda}>
            <Text style={styles.ayudaTitulo}>Para activarlo:</Text>
            <Text style={styles.ayudaTexto}>1. Abre los Ajustes del teléfono.</Text>
            <Text style={styles.ayudaTexto}>2. Entra a Aplicaciones y busca Expo Go.</Text>
            <Text style={styles.ayudaTexto}>3. Toca Permisos y luego Cámara.</Text>
            <Text style={styles.ayudaTexto}>4. Elige "Permitir" y regresa a la app.</Text>

            <Pressable style={styles.botonAjustes} onPress={() => Linking.openSettings()}>
              <Text style={styles.botonTexto}>Abrir ajustes</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.centro}>
        <Text style={styles.titulo}>Permiso de cámara</Text>
        <Text style={styles.texto}>
          Necesitamos tu cámara para tomar una foto dentro de la app.
        </Text>

        <Pressable style={styles.boton} onPress={alPermitir}>
          <Text style={styles.botonTexto}>Permitir</Text>
        </Pressable>

        <Pressable style={styles.botonSecundario} onPress={() => setPermisoNegado(true)}>
          <Text style={styles.botonSecundarioTexto}>No permitir</Text>
        </Pressable>
      </View>
    );
  }

  const tomarFoto = async () => {
    if (!camaraRef.current || !camaraLista || tomandoFoto) return;

    setTomandoFoto(true);
    try {
      const resultado = await camaraRef.current.takePictureAsync();
      if (resultado?.uri) {
        setFotoTomada(resultado.uri);
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    } finally {
      setTomandoFoto(false);
    }
  };

  if (fotoTomada) {
    return (
      <View style={styles.centro}>
        <Text style={styles.titulo}>Foto Tomada</Text>
        <Image source={{ uri: fotoTomada }} style={styles.foto} />
        <Pressable style={styles.boton} onPress={() => { setFotoTomada(null); setCamaraLista(false);}}>
          <Text style={styles.botonTexto}>Tomar otra foto</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.marcoCamara}>
      <CameraView style={styles.camara} facing="back" ref={camaraRef} onCameraReady={() => setCamaraLista(true)} />

      <View style={styles.zonaBoton}>
        <Pressable
          style={[styles.botonFoto, (!camaraLista || tomandoFoto) && { opacity: 0.4 }]}
          onPress={tomarFoto}
          disabled={!camaraLista || tomandoFoto}
        >
          <Text style={styles.botonTexto}>
            {tomandoFoto ? 'Tomando foto...' : camaraLista ? 'Tomar foto' : 'Iniciando cámara...'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 24, 
  },
  titulo: { 
    color: '#FFFFFF', 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10, 
  },
  texto: { 
    color: '#FADCD5', 
    fontSize: 15, 
    textAlign: 'center', 
    marginBottom: 20, 
    lineHeight: 21, 
  },
  boton: { 
    backgroundColor: '#722548', 
    paddingVertical: 13, 
    paddingHorizontal: 26, 
    borderRadius: 12, 
  },
  botonTexto: { 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: 16, 
  },
  botonSecundario: { 
    marginTop: 14, 
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
  ayuda: { 
    marginTop: 16, 
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
  foto: { 
    width: 280, 
    height: 380, 
    borderRadius: 18, 
    marginBottom: 20, 
    borderWidth: 2, 
    borderColor: '#5D3C64', 
  },
  marcoCamara: { 
    flex: 1, 
    marginHorizontal: 16, 
    marginBottom: 16, 
    borderRadius: 20, 
    overflow: 'hidden', 
    backgroundColor: '#2D222F', 
  },
  camara: { 
    flex: 1, 
  },
  zonaBoton: { 
    position: 'absolute', 
    bottom: 18, 
    left: 0, 
    right: 0, 
    alignItems: 'center', 
  },
  botonFoto: { 
    backgroundColor: '#722548', 
    paddingVertical: 13, 
    paddingHorizontal: 28, 
    borderRadius: 30, 
    borderWidth: 2, 
    borderColor: '#F9AAAD', 
  },
});