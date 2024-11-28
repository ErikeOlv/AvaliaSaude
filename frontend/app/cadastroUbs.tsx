import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

// Variáveis de estado
const CadastroUbs = () => {
  const [nome, setNome] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [imagem, setImagem] = useState('');
  const router = useRouter(); // Objeto hook da biblioteca expo-router

  // Chamada da API de CRUD da UBS
  const handleCadastro = () => {
    const apiUrl = 'http://10.0.2.2:8080/avaliasaude/api/ubs/criar'; // Chamada da API de criação de UBS

    // Validação dos campos
    if (!nome || !latitude || !longitude || !logradouro || !bairro || !cidade || !estado || !cep) {
      Alert.alert('Atenção', 'Preencha todos os campos disponíveis.');
      return;
    }

    // Objeto com os dados do cadastro da UBS
    const novaUbs = {
      nome,
      latitude,
      longitude,
      logradouro,
      numero,
      bairro,
      cidade,
      estado,
      cep,

      imagem,
    };

    // Método axios para envio de informações para a API de CRUD
    axios.post(apiUrl, novaUbs)
      .then((response) => {

        // Resposta da API e tratamento do JSON recebido
        if (response.data.status === 'success') {
          Alert.alert('Cadastro concluído', 'Cadastro da UBS realizado com sucesso.');
          router.push('/ubsAdmin'); // Redirecionar para a lista de UBSs
        } else {
          Alert.alert('Falha no cadastro', response.data.message || 'Erro ao cadastrar UBS.');
        }
      })
      .catch((error) => {
        if (!error.response) {
          Alert.alert('Erro de conexão', 'Falha na conexão com o servidor. Tente novamente mais tarde.');
        } else {
          const errorMessage = error.response.data?.message || 'Erro desconhecido. Tente novamente.';
          Alert.alert('Falha no cadastro', errorMessage);
        }
      });
  };

  // Containers e objetos de estilo
  return (
    <View style={estilos.container}>
      <TextInput
        style={estilos.input}
        placeholder="Nome da UBS"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={estilos.input}
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />
      <TextInput
        style={estilos.input}
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
      />
      <TextInput
        style={estilos.input}
        placeholder="Logradouro"
        value={logradouro}
        onChangeText={setLogradouro}
      />
      <TextInput
        style={estilos.input}
        placeholder="Número"
        value={numero}
        onChangeText={setNumero}
      />
      <TextInput
        style={estilos.input}
        placeholder="Bairro"
        value={bairro}
        onChangeText={setBairro}
      />
      <TextInput
        style={estilos.input}
        placeholder="Cidade"
        value={cidade}
        onChangeText={setCidade}
      />
      <TextInput
        style={estilos.input}
        placeholder="Estado"
        value={estado}
        onChangeText={setEstado}
        maxLength={2}
      />
      <TextInput
        style={estilos.input}
        placeholder="CEP"
        value={cep}
        onChangeText={setCep}
      />
      <TextInput
        style={estilos.input}
        placeholder="Imagem (URL)"
        value={imagem}
        onChangeText={setImagem}
      />
      <TouchableOpacity style={estilos.botao} onPress={handleCadastro}>
        <Text style={estilos.textoBotao}>Confirmar cadastro</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos
const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  radioBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  radioCirculo: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 8,
  },
  radioSelecionado: {
    backgroundColor: '#fcc404',
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

// Exportação do tela de cadastro de UBS
export default CadastroUbs;
