import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

// Variáveis de estado
const CadastroAdmin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [sexo, setSexo] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');
  const router = useRouter(); // Objeto hook da biblioteca expo-router

  // Função para alterar o sexo
  const alterarSexo = (genero) => {
    setSexo(genero);
  };

  // Função para alterar o tipo de usuário
  const alterarTipoUsuario = (tipo) => {
    setTipoUsuario(tipo);
  };

  // Chamada da API de CRUD do usuário
  const handleCadastro = () => {
    const apiUrl = 'http://10.0.2.2:8080/avaliasaude/api/usuario/criar';

    // Validação dos campos
    if (!email || !senha || !nome || !cpf || !telefone || !nascimento || !sexo || !tipoUsuario) {
      Alert.alert('Atenção', 'Preencha todos os campos disponíveis.');
      return;
    }

    // Objeto com os dados do cadastro
    const novoUsuario = {
      nome,
      cpf,
      email,
      senha,
      telefone,
      nascimento,
      sexo,
      tipo_usuario: tipoUsuario,
    };

    // Método axios para envio de informações para a API de CRUD
    axios.post(apiUrl, novoUsuario)
      .then((response) => {

        // Resposta da API e tratamento do JSON recebido
        if (response.data.status === 'success') {
          Alert.alert('Cadastro concluído', 'Cadastro realizado com sucesso!');
          router.push('/usuariosAdmin');
        } else {
          Alert.alert('Falha no cadastro', response.data.message || 'Erro ao cadastrar usuário.');
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
      <Image
        source={require('@/assets/images/AvaliaSaudeLogo.png')}
        style={estilos.logo}
      />
      <TextInput
        style={estilos.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={estilos.input}
        placeholder="CPF"
        value={cpf}
        onChangeText={setCpf}
      />
      <TextInput
        style={estilos.input}
        placeholder="Data de Nascimento"
        value={nascimento}
        onChangeText={setNascimento}
      />

      <View style={estilos.radioContainer}>
        <Text>Sexo:</Text>
        <TouchableOpacity
          style={estilos.radioBotao}
          onPress={() => alterarSexo('M')}
        >
          <View style={[estilos.radioCirculo, sexo === 'M' && estilos.radioSelecionado]} />
          <Text>Masculino</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={estilos.radioBotao}
          onPress={() => alterarSexo('F')}
        >
          <View style={[estilos.radioCirculo, sexo === 'F' && estilos.radioSelecionado]} />
          <Text>Feminino</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={estilos.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={estilos.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
      />
      <TextInput
        style={estilos.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <View style={estilos.radioContainer}>
        <Text>Tipo de usuário:</Text>
        <TouchableOpacity
          style={estilos.radioBotao}
          onPress={() => alterarTipoUsuario('administrador')}
        >
          <View style={[estilos.radioCirculo, tipoUsuario === 'administrador' && estilos.radioSelecionado]} />
          <Text>Administrador</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={estilos.radioBotao}
          onPress={() => alterarTipoUsuario('usuario')}
        >
          <View style={[estilos.radioCirculo, tipoUsuario === 'usuario' && estilos.radioSelecionado]} />
          <Text>Usuário</Text>
        </TouchableOpacity>
      </View>

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
  logo: {
    width: 180,
    height: 180,
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

// Exportação da tela de cadastro
export default CadastroAdmin;
