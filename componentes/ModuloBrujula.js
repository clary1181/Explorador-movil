import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Animated, ActivityIndicator } from 'react-native';
import { Magnetometer } from 'expo-sensors';

const PUNTOS = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
const nombreDireccion = (grados) => PUNTOS[Math.round(grados / 45) % 8];

export default function ModuloBrujula() {
  const [estadoSensor, setEstadoSensor] = useState('revisando');
  const [datos, setDatos] = useState({ x: 0, y: 0, z: 0 });
  const [angulo, setAngulo] = useState(0);

  const giro = useRef(new Animated.Value(0)).current; 
  const anguloAnterior = useRef(0);                  
  const anguloAcumulado = useRef(0);                 
  const lecturaSuave = useRef({ x: 0, y: 0, listo: false });

  useEffect(() => {
    let cancelado = false; 

    const revisarSensor = async () => {
      try {
        const disponible = await Magnetometer.isAvailableAsync();
        if (!cancelado) setEstadoSensor(disponible ? 'disponible' : 'noDisponible');
      } catch (error) {
        if (!cancelado) setEstadoSensor('noDisponible');
      }
    };
    revisarSensor();

    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    if (estadoSensor !== 'disponible') return;

    Magnetometer.setUpdateInterval(100);

    const suscripcion = Magnetometer.addListener(({ x, y, z }) => {
      setDatos({ x, y, z });

      const s = lecturaSuave.current;
      if (!s.listo) {
        s.x = x;
        s.y = y;
        s.listo = true;
      } else {
        s.x = s.x * 0.8 + x * 0.2;
        s.y = s.y * 0.8 + y * 0.2;
      }

      let nuevo = (Math.atan2(s.y, s.x) * 180) / Math.PI - 90;
      nuevo = (nuevo + 360) % 360;
      setAngulo(Math.round(nuevo));

      const diferencia = ((nuevo - anguloAnterior.current + 540) % 360) - 180;
      anguloAcumulado.current += diferencia;
      anguloAnterior.current = nuevo;

      Animated.timing(giro, {
        toValue: -anguloAcumulado.current,
        duration: 120,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      suscripcion.remove();
    };
  }, [estadoSensor]);

  const girar = giro.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg'],
  });

  if (estadoSensor === 'revisando') {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#F9AAAD" />
        <Text style={styles.texto}>Revisando sensor...</Text>
      </View>
    );
  }

  if (estadoSensor === 'noDisponible') {
    return (
      <View style={styles.centro}>
        <Text style={styles.titulo}>Sensor no disponible</Text>
        <Text style={styles.texto}>
          Este teléfono no tiene magnetómetro, así que no podemos mostrar la orientación. La app sigue funcionando con normalidad.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.titulo}>Brújula</Text>

      <View style={styles.flecha} />

      <View style={styles.dial}>
        <Animated.View style={[styles.capaGiratoria, { transform: [{ rotate: girar }] }]}>
          <Text style={[styles.letra, styles.letraN]}>N</Text>
          <Text style={[styles.letra, styles.letraE]}>E</Text>
          <Text style={[styles.letra, styles.letraS]}>S</Text>
          <Text style={[styles.letra, styles.letraO]}>O</Text>
        </Animated.View>

        <View style={styles.centroDial}>
          <Text style={styles.anguloTexto}>{angulo}°</Text>
          <Text style={styles.direccionTexto}>{nombreDireccion(angulo)}</Text>
        </View>
      </View>

      <View style={styles.tarjeta}>
        <Text style={styles.tarjetaTitulo}>Lectura del magnetómetro</Text>
        {['x', 'y', 'z'].map((eje) => (
          <View key={eje} style={styles.fila}>
            <Text style={styles.ejeNombre}>{eje.toUpperCase()}</Text>
            <Text style={styles.ejeValor}>{datos[eje].toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const Tamaño = 230;

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
    marginBottom: 14, 
  },
  texto: { 
    color: '#FADCD5', 
    fontSize: 15, 
    textAlign: 'center', 
    marginBottom: 20, 
    lineHeight: 21, 
  },
  flecha: {
    width: 0, 
    height: 0,
    borderLeftWidth: 9, 
    borderRightWidth: 9, 
    borderTopWidth: 16,
    borderLeftColor: 'transparent', 
    borderRightColor: 'transparent', 
    borderTopColor: '#F9AAAD',
  },
  dial: {
    width: Tamaño, 
    height: Tamaño, 
    borderRadius: Tamaño / 2,
    backgroundColor: '#2D222F', 
    borderWidth: 3, 
    borderColor: '#5D3C64',
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 22,
  },
  capaGiratoria: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
  },
  letra: { 
    position: 'absolute', 
    color: '#D391B0', 
    fontWeight: 'bold', 
    fontSize: 18, 
  },
  letraN: { 
    top: 8, 
    left: 0, 
    right: 0, 
    textAlign: 'center', 
    color: '#F9AAAD', 
    fontSize: 24, 
  },
  letraS: { 
    bottom: 8, 
    left: 0, 
    right: 0, 
    textAlign: 'center', 
  },
  letraE: { 
    right: 12, 
    top: '44%', 
  },
  letraO: { 
    left: 12, 
    top: '44%', 
  },
  centroDial: { 
    alignItems: 'center', 
  },
  anguloTexto: { 
    color: '#FFFFFF', 
    fontSize: 46, 
    fontWeight: 'bold', 
  },
  direccionTexto: { 
    color: '#F9AAAD', 
    fontSize: 18, 
    fontWeight: 'bold', 
  },
  tarjeta: { 
    backgroundColor: '#2D222F', 
    borderRadius: 16, 
    padding: 18, 
    width: '100%', 
    borderWidth: 1, 
    borderColor: '#5D3C64', 
  },
  tarjetaTitulo: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 8, 
  },
  fila: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 6, 
    borderBottomWidth: 1, 
    borderBottomColor: '#462037', 
  },
  ejeNombre: { 
    color: '#D391B0', 
    fontSize: 16, 
    fontWeight: '600', 
  },
  ejeValor: { 
    color: '#F9AAAD', 
    fontSize: 16, 
    fontWeight: 'bold', 
  },
});