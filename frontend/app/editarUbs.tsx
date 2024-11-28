import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Função para edição da UBS
const EditarUbs = () => {
  const params = useLocalSearchParams(); // Capta os parâmetros da URL
  const { id } = params; // Extrai o ID da UBS
  const [ubs, setUbs] = useState({
    nome: '',
    latitude: '',
    longitude: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    imagem: '',
  });
  const router = useRouter();

  // Função para carregamento de outras funções antes da renderização da tela 
  useEffect(() => {
    if (id) {
      axios
        .get(`http://10.0.2.2:8080/avaliasaude/api/ubs/${id}`) // Chamada da API de informações da UBS
        .then((response) => {
          const { nome, latitude, longitude, logradouro, numero, bairro, cidade, estado, cep, imagem } = response.data;
          setUbs({
            nome,
            latitude: String(latitude),
            longitude: String(longitude),
            logradouro,
            numero,
            bairro,
            cidade,
            estado,
            cep,
            imagem,
          });
        })
        .catch(() => Alert.alert('Erro', 'Não foi possível carregar os dados da UBS.'));
    }
  }, [id]);

  // Função para salvar as edições realizadas
  const handleSalvar = () => {
    axios
      .put(`http://10.0.2.2:8080/avaliasaude/api/ubs/atualizar/${id}`, ubs) // Chamada da API para edição da UBS
      .then(() => {
        Alert.alert('Sucesso', 'Dados da UBS atualizados.');
        router.push('/ubsAdmin'); // Retorna para a lista de UBS
      })
      .catch((error) => {
        if (!error.response) {
          // Caso haja erro de conexão
          Alert.alert('Erro de conexão', 'Falha na conexão com o servidor. Tente novamente mais tarde.');
        } else {
          // Caso haja erro na resposta da API
          const errorMessage = error.response.data?.message || 'Erro desconhecido. Tente novamente.';
          Alert.alert('Falha na atualização', errorMessage);
        }
      });
  };

  // Containers e objetos de estilo
  return (
    <View style={estilos.container}>

      <TextInput
        style={estilos.input}
        placeholder="Nome da UBS"
        value={ubs.nome}
        onChangeText={(text) => setUbs({ ...ubs, nome: text })}
      />
      <TextInput
        style={estilos.input}
        placeholder="Latitude"
        value={ubs.latitude}
        onChangeText={(text) => setUbs({ ...ubs, latitude: text })}
        keyboardType="numeric"
      />
      <TextInput
        style={estilos.input}
        placeholder="Longitude"
        value={ubs.longitude}
        onChangeText={(text) => setUbs({ ...ubs, longitude: text })}
        keyboardType="numeric"
      />
      <TextInput
        style={estilos.input}
        placeholder="Logradouro"
        value={ubs.logradouro}
        onChangeText={(text) => setUbs({ ...ubs, logradouro: text })}
      />
      <TextInput
        style={estilos.input}
        placeholder="Número"
        value={ubs.numero}
        onChangeText={(text) => setUbs({ ...ubs, numero: text })}
      />
      <TextInput
        style={estilos.input}
        placeholder="Bairro"
        value={ubs.bairro}
        onChangeText={(text) => setUbs({ ...ubs, bairro: text })}
      />
      <TextInput
        style={estilos.input}
        placeholder="Cidade"
        value={ubs.cidade}
        onChangeText={(text) => setUbs({ ...ubs, cidade: text })}
      />
      <TextInput
        style={estilos.input}
        placeholder="Estado (UF)"
        value={ubs.estado}
        onChangeText={(text) => setUbs({ ...ubs, estado: text })}
        maxLength={2}
      />
      <TextInput
        style={estilos.input}
        placeholder="CEP"
        value={ubs.cep}
        onChangeText={(text) => setUbs({ ...ubs, cep: text })}
      />
      <TextInput
        style={estilos.input}
        placeholder="Imagem (URL)"
        value={ubs.imagem}
        onChangeText={(text) => setUbs({ ...ubs, imagem: text })}
      />

      <TouchableOpacity style={estilos.botao} onPress={handleSalvar}>
        <Text style={estilos.textoBotao}>Salvar Alterações</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos
const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 15,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
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
    fontWeight: 'bold',
  },
});

// Exportação da tela de edição de UBS
export default EditarUbs;
