import React, { useState, useEffect } from 'react';  // Adicionando useEffect
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store'; // Importando o SecureStore

// Variáveis de estado
const TelaDeLogin = () => {
  const [email, setEmail] = useState(''); 
  const [senha, setSenha] = useState('');
  const router = useRouter(); // Objeto hook da biblioteca expo-router

  // Função para salvar dados no SecureStore
  const saveUserData = async (id, nome) => {
    try {
      await SecureStore.setItemAsync('userId', id.toString()); // ID se torna uma variável global
      await SecureStore.setItemAsync('userName', nome); // Nome se torna uma variável global
    } catch (error) {
      console.error('Erro ao salvar dados no SecureStore:', error);
    }
  };

  // Chamada da API de login com o IP para emulação Android
  const handleLogin = () => {
    const apiUrl = 'http://10.0.2.2:8080/avaliasaude/api/login';

    // Validação do preenchimento dos campos
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos disponíveis.');
      return;
    }

    // Método axios para envio de informações para a API de login
    axios.post(apiUrl, { email, senha })
      .then((response) => {

        // Resposta da API e tratamento do JSON recebido
        if (response.data.status === 'success') {
          Alert.alert('Login concluído', `Olá, ${response.data.usuario.nome}!`); // Em caso de {status = success} o usuário receberá um alert de boas vindas

          // Salvar o id e nome do usuário no SecureStore
          saveUserData(response.data.usuario.id, response.data.usuario.nome);

          // Caso seja um administrador acontecerá o redirecionamento para a tela especifica de crud
          if (response.data.usuario.tipo_usuario === 'administrador') {
            router.push('/admin');
          }
          
          // Caso seja um usuário acontecerá o redirecionamento para a página home do avaliasaude
          else {
            router.push('/home'); 
          }

        // Alert para caso não seja validado nenhum dos dois tipos de usuário
        } else {
          Alert.alert('Falha no login', response.data.message);
        }
      })

      // Tratamento para falha na conexão com o servidor
      .catch((error) => {
        if (!error.response) {
          Alert.alert('Erro de conexão', 'Falha na conexão com o servidor. Tente novamente mais tarde.');
        } 
        // Alert para erro desconhecido e erro de credencial
        else {
          const errorMessage = error.response.data?.message || 'Erro desconhecido. Tente novamente.';
          Alert.alert('Falha no login', errorMessage);
        }
      });
  };

  // Containers e objetos de estilo
  return (
    <View style={estilos.container}>
      <Image 
        source={require('@/assets/images/AvaliaSaudeLogo.png')}
        style={estilos.logo}
      />
      <TextInput
        style={estilos.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={estilos.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TouchableOpacity style={estilos.botao} onPress={handleLogin}>
        <Text style={estilos.textoBotao}>Entrar</Text>
      </TouchableOpacity>

      <View style={estilos.textoCadastroContainer}>
        <Text style={estilos.textoSimples}>ou então </Text>
        <TouchableOpacity onPress={() => router.push('/cadastro')}>
          <Text style={estilos.textoCadastro}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
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
  logo: {
    width: 250,
    height: 250,
    alignSelf: 'center',
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
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
  textoCadastroContainer: {
    flexDirection: 'row',
    justifyContent: 'left',
    marginTop: 15,
  },
  textoSimples: {
    fontSize: 14,
    color: '#000',
  },
  textoCadastro: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#049434',
  },
});

// Exportação da tela de login
export default TelaDeLogin;
