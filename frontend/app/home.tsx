import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

const Home = () => {
  const [ubs, setUbs] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [localizacaoAtual, setLocalizacaoAtual] = useState(null);
  const apiUrlListar = 'http://10.0.2.2:8080/avaliasaude/api/ubs/'; // URL da API de dados da UBS
  const router = useRouter();

  // Obtém a localização do dispositivo
  useEffect(() => {
    obterLocalizacaoAtual();
  }, []);

   // Função para carregamento de outras funções antes da renderização da tela 
  useEffect(() => {
    if (localizacaoAtual) {
      carregarUbs();
    }
  }, [localizacaoAtual]);

  // Função para obter a localização do dispositivo
  const obterLocalizacaoAtual = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão para acessar a localização foi negada.');
        return;
      }
      const localizacao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest, // Garante a maior precisão da localização
      });
      setLocalizacaoAtual(localizacao.coords);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter a localização. Verifique as configurações do dispositivo.');
    }
  };

  // Função para carregar as UBS e calcular a distância
  const carregarUbs = () => {
    axios
      .get(apiUrlListar)
      .then((response) => {
        const ubsComDistancia = response.data.map((ubs) => ({
          ...ubs,
          distancia: calcularDistancia(localizacaoAtual, ubs.latitude, ubs.longitude),
        }));
        setUbs(ubsComDistancia.sort((a, b) => a.distancia - b.distancia)); // Ordenação pela distância
      })
      .catch(() => {
        Alert.alert('Erro', 'Não foi possível carregar as UBS.');
      });
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

  // Renderização do card de cada UBS
  const renderUbs = ({ item }) => (
    <TouchableOpacity
      style={estilos.card}
      onPress={() => router.push(`/detalhesUbs?id=${item.id}`)} // URL para a página de detalhes
    >
      <View style={estilos.infoContainer}>
        <Text style={estilos.nome}>{item.nome}</Text>
        <Text style={estilos.endereco}>
          {item.logradouro}, {item.numero} - {item.bairro}, {item.cidade} - {item.estado}
        </Text>
        <Text style={estilos.distancia}>{item.distancia.toFixed(2)} km</Text>
      </View>
    </TouchableOpacity>
  );

  // Filtro de pesquisa para a UBS com base na pesquisa
  const ubsFiltradas = ubs.filter(
    (ubs) =>
      ubs.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      ubs.cidade.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      ubs.cep.includes(termoPesquisa)
  );

  // Containers e objetos de estilo
  return (
    <View style={estilos.container}>
      <Image source={require('@/assets/images/AvaliaSaudeLogo.png')} style={estilos.logo} />

      <TextInput
        style={estilos.barraPesquisa}
        placeholder="Pesquisar por nome, cidade ou CEP"
        value={termoPesquisa}
        onChangeText={setTermoPesquisa}
      />

      <FlatList
        data={ubsFiltradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUbs}
        contentContainerStyle={estilos.lista}
      />
    </View>
  );
};

// Estilos
const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 15,
  },
  lista: {
    paddingBottom: 15,
  },
  barraPesquisa: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignSelf: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  infoContainer: {
    flex: 1,
  },
  nome: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  endereco: {
    fontSize: 13,
    color: '#555',
    marginBottom: 5,
  },
  distancia: {
    fontSize: 13,
    color: '#000',
    fontWeight: 'bold',
  },
});

// Exportação da tela inicial
export default Home;
