import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router'; 
import * as SecureStore from 'expo-secure-store'; 
import axios from 'axios';

// Variáveis de estado
const Avaliacoes = () => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [nota, setNota] = useState('');
  const [comentario, setComentario] = useState(0);
  const [usuario, setUsuario] = useState({ id: null, nome: '' });
  const [ubsNome, setUbsNome] = useState(''); 
  const { id } = useLocalSearchParams();

  // Função para carregamento de outras funções antes da renderização da tela 
  useEffect(() => {
    carregarAvaliacoes();
    obterDadosUsuario();
    carregarUbsNome();
  }, []);

  // Função para carregamento de avaliações
  const carregarAvaliacoes = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8080/avaliasaude/api/avaliacao/${id}`); // Chamada da API de avaliações de UBS
      if (response.data.message) {
        Alert.alert('Aviso', response.data.message);
      } else {
        setAvaliacoes(response.data.avaliacoes.reverse());
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as avaliações.');
    }
  };

  // Função para carregamento das variáveis globais
  const obterDadosUsuario = async () => {
    try {
      const idUsuario = await SecureStore.getItemAsync('userId'); // Capta a variável global ID
      const nomeUsuario = await SecureStore.getItemAsync('userName'); // Capta a variável global nome
      if (idUsuario && nomeUsuario) {
        setUsuario({ id: idUsuario, nome: nomeUsuario });
      }
    } catch (error) {
      console.error('Erro ao obter dados do usuário', error);
    }
  };

  // Função para carregamento do nome da UBS
  const carregarUbsNome = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8080/avaliasaude/api/ubs/${id}`); //Chamada da API de UBS com o IP para emulação Android
      setUbsNome(response.data.nome);
    } catch (error) {
      console.error('Erro ao obter nome da UBS', error);
    }
  };

  // Função para envio da avaliação
  const enviarAvaliacao = async () => {
    if (nota === 0 || !comentario) {
      Alert.alert('Erro', 'Por favor, preencha a nota e o comentário.');
      return;
    }

    // Requisição para a API de criação de avaliação
    try {
      const response = await axios.post('http://10.0.2.2:8080/avaliasaude/api/avaliacao/criar', { // Chamada da API de criação de avaliações
        ubsId: id,
        ubsNome: ubsNome, 
        usuarioId: usuario.id,
        usuarioNome: usuario.nome,
        nota: nota, 
        comentario,
        data: new Date().toISOString(),
      });

      if (response.status === 201) {
        Alert.alert('Sucesso', 'Avaliação enviada com sucesso!');
        carregarAvaliacoes();
        setComentario('');
      } else {
        Alert.alert('Erro', 'Erro ao enviar avaliação.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar a avaliação.');
    }
  };

  // Containers e objetos de estilo
  return (
    <ScrollView style={estilos.container}>

      <Text style={estilos.titulo}>Avaliações</Text>
      <Text style={estilos.subtitulo}>Deixe sua avaliação</Text>
      <TextInput
        style={estilos.input}
        placeholder="Digite seu comentário"
        multiline
        value={comentario}
        onChangeText={setComentario}
      />

      {/* Estrela para seleção de nota, com base no mapa de inteiros*/}
      <View style={estilos.estrelasInput}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Ionicons
            key={i}
            name={i <= nota ? 'star' : 'star-outline'}
            size={25}
            color={i <= nota ? '#f39c12' : '#bdc3c7'}
            onPress={() => setNota(i)}
          />
        ))}
      </View>

      <TouchableOpacity style={estilos.botao} onPress={enviarAvaliacao}>
        <Text style={estilos.textoBotao}>Enviar avaliação</Text>
      </TouchableOpacity>

      {/* Estrutura para renderização das avaliações*/}
      <Text style={estilos.subtitulo}>Outras avaliações</Text>
      {Array.isArray(avaliacoes) && avaliacoes.length > 0 ? (
        avaliacoes.map((avaliacao, index) => (
          <View key={index} style={estilos.avaliacao}>
            <Text style={estilos.nomeUsuario}>{avaliacao.usuarioNome}</Text>
            <View style={estilos.estrelas}>
              {Array(5).fill().map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < avaliacao.nota ? 'star' : 'star-outline'}
                  size={15}
                  color={i < avaliacao.nota ? '#f39c12' : '#bdc3c7'}
                />
              ))}
            </View>
            <Text style={estilos.comentario}>{avaliacao.comentario}</Text>
            <Text style={estilos.data}>{(avaliacao.dataAvaliacao)}</Text>
          </View>
        ))
      ) : (
        <Text>Não há avaliações disponíveis.</Text>
      )}

    </ScrollView>
  );
};

// Estilos
const estilos = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#ffffff',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  avaliacao: {
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 15,
  },
  nomeUsuario: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  estrelas: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  comentario: {
    fontSize: 15,
    color: '#7f8c8d',
  },
  data: {
    fontSize: 15,
    color: '#bdc3c7',
    marginTop: 5,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  input: {
    height: 100,
    fontSize: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  estrelasInput: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  botao: {
    width: '100%',
    backgroundColor: '#049434',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

// Exportação da tela de avaliações
export default Avaliacoes;
