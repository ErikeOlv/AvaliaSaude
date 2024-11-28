import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// Variáveis de estado
const DetalhesUbs = () => {
  const [localizacaoAtual, setLocalizacaoAtual] = useState(null);
  const [ubsDetalhes, setUbsDetalhes] = useState(null);
  const [distancia, setDistancia] = useState(null);
  const { id } = useLocalSearchParams();
  const [avaliacao, setAvaliacao] = useState(0);
  const router = useRouter();

  // Função para carregamento de outras funções antes da renderização da tela 
  useEffect(() => {
    obterLocalizacaoAtual();
    carregarUbsDetalhes();
    carregarMediaAvaliacoes();
  }, [id]);

  // Função para obter a localização do dispositivo
  const obterLocalizacaoAtual = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão para acessar a localização foi negada.');
        return;
      }
      const localizacao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setLocalizacaoAtual(localizacao.coords);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter a localização.');
    }
  };

  // Função para carregar os detalhes da UBS
  const carregarUbsDetalhes = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8080/avaliasaude/api/ubs/${id}`); // Chamada da API de informações da UBS
      setUbsDetalhes(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da UBS.');
    }
  };

  // Função para carregar a média de avaliações
  const carregarMediaAvaliacoes = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8080/avaliasaude/api/avaliacao/${id}`); // Chamada ds API de avaliações da UBS
      setAvaliacao(response.data.media); 
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a média de avaliações.');
    }
  };

  // Função para calcular a distância entre dois pontos geográficos utilizando a fórmula de haversine
  const calcularDistancia = (localizacaoAtual, lat2, lon2) => {
    const { latitude, longitude } = localizacaoAtual;
    const R = 6371; // Raio da Terra em KM
    const dLat = degToRad(lat2 - latitude);
    const dLon = degToRad(lon2 - longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(latitude)) * Math.cos(degToRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c; // Distância em KM
    return distancia;
  };

  // Função para converter graus para radianos
  const degToRad = (deg) => {
    return deg * (Math.PI / 180);
  };

  // Função para carregamento de outras funções antes da renderização da tela 
  useEffect(() => {
    if (localizacaoAtual && ubsDetalhes) {
      const dist = calcularDistancia(localizacaoAtual, ubsDetalhes.latitude, ubsDetalhes.longitude);
      setDistancia(dist);
    }
  }, [localizacaoAtual, ubsDetalhes]);

  if (!ubsDetalhes || !localizacaoAtual) {
    return (
      <View style={estilos.container}>
        <Image
          source={require('@/assets/images/AvaliaSaudeLogo.png')}
          style={estilos.logo}
        />
      </View>
    );
  }

  // Containers e objetos de estilo
  return (
    <ScrollView style={estilos.container}>

      <Image
        source={require('@/assets/images/AvaliaSaudeLogo.png')}
        style={estilos.logo}
      />

      <Text style={estilos.nome}>{ubsDetalhes.nome}</Text>
      <Text style={estilos.endereco}>
        {ubsDetalhes.logradouro}, {ubsDetalhes.numero} - {ubsDetalhes.bairro}, {ubsDetalhes.cidade} - {ubsDetalhes.estado}
      </Text>
      <Text style={estilos.distancia}>
        {distancia !== null ? distancia.toFixed(2) : 'Calculando...'} km
      </Text>

      <MapView
        style={estilos.mapa}
        region={{
          latitude: ubsDetalhes.latitude,
          longitude: ubsDetalhes.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker
          coordinate={{
            latitude: ubsDetalhes.latitude,
            longitude: ubsDetalhes.longitude,
          }}
          title={ubsDetalhes.nome}
          description={`Distância: ${distancia !== null ? distancia.toFixed(2) : 'Calculando...'} km`}
        />
      </MapView>

      <TouchableOpacity
        style={estilos.containerInferior}
        onPress={() => router.push(`/servicos?id=${id}`)}>
        <Text style={estilos.titulo}>Serviços disponíveis</Text>
        <Text style={estilos.textoAvaliacoes}>
          Clique para ver os serviços disponíveis
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={estilos.containerInferior}
        onPress={() => router.push(`/avaliacoes?id=${id}`)}>
        <Text style={estilos.titulo}>Avaliações</Text>
        <View style={estilos.notaEEstrelas}>

          <Text style={estilos.notaGeral}>
            {avaliacao ? Math.round(avaliacao * 10) / 10 : '0.0'}
          </Text>
          <View style={estilos.estrelas}>
            {Array.from({ length: 5 }, (_, index) => (
              <Ionicons
                key={index}
                name={index < Math.round(avaliacao) ? 'star' : 'star-outline'}
                size={25}
                color={index < Math.round(avaliacao) ? '#f39c12' : '#bdc3c7'}
              />
            ))}
          </View>
        </View>
        <Text style={estilos.textoAvaliacoes}>
          Clique para ver as avaliações ou avaliar
        </Text>
      </TouchableOpacity>

      <View style={estilos.espaçoFinal} />
    </ScrollView>
  );
};

// Estilos
const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 15,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  endereco: {
    fontSize: 15,
    color: '#7f8c8d',
    marginBottom: 15,
    textAlign: 'center',
  },
  distancia: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 15,
    textAlign: 'center',
  },
  mapa: {
    height: 200,
    marginBottom: 15,
  },
  containerInferior: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    padding: 20,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  notaEEstrelas: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  notaGeral: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginRight: 10,
  },
  estrelas: {
    flexDirection: 'row',
  },
  textoAvaliacoes: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
    textAlign: 'center',
  },
  espaçoFinal: {
    height: 20,
  },
});

// Exportação da tela de detalhes da UBS
export default DetalhesUbs;
