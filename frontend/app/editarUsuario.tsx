import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Função para edição do usuário
const EditarUsuario = () => {
  const params = useLocalSearchParams(); // Capta os parâmetros da URL
  const { id } = params; // Extrai o ID
  const [usuario, setUsuario] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    senha: '',
    nascimento: '',
    sexo: '',
    tipo_usuario: '',
  });
  const router = useRouter();

  // Função para carregamento de outras funções antes da renderização da tela 
  useEffect(() => {
    if (id) {
      
      // Busca os dados do usuário com base no ID pela API usuario
      axios
        .get(`http://10.0.2.2:8080/avaliasaude/api/usuario/${id}`)
        .then((response) => {
          const { nome, cpf, email, telefone, senha, sexo, tipo_usuario } = response.data;
         
          setUsuario({
            nome,
            cpf,
            email,
            telefone,
            senha,
            nascimento: '', 
            sexo,
            tipo_usuario,
          });
        })
        .catch(() => Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.'));
    }
    }, [id]);
  
  // Função para salvar as edições realizadas
  const handleSalvar = () => {
    if (!usuario.nascimento) {
        Alert.alert('Atenção', 'Preencha todos os campos disponíveis.');
        return;
      }
    axios
      .put(`http://10.0.2.2:8080/avaliasaude/api/usuario/atualizar/${id}`, usuario) // Chamada da API para a edição do usuário
      .then(() => {
        Alert.alert('Sucesso', 'Dados do usuário atualizados!');
        router.push('/usuariosAdmin'); // Retorna para a lista de usuários
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
      <Image
        source={require('@/assets/images/AvaliaSaudeLogo.png')}
        style={estilos.logo}
      />
      <TextInput
        style={estilos.input}
        placeholder="Nome"
        value={usuario.nome}
        onChangeText={(text) => setUsuario({ ...usuario, nome: text })}
      />
      <TextInput
        style={estilos.input}
        placeholder="CPF"
        value={usuario.cpf}
        onChangeText={(text) => setUsuario({ ...usuario, cpf: text })}
      />
      <TextInput
        style={estilos.input}
        placeholder="Confirme sua data de nascimento"
        value={usuario.nascimento}
        onChangeText={(text) => setUsuario({ ...usuario, nascimento: text })}
      />

      <View style={estilos.radioContainer}>
        <Text>Sexo:</Text>
        <TouchableOpacity
          style={estilos.radioBotao}
          onPress={() => setUsuario({ ...usuario, sexo: 'M' })}
        >
          <View style={[estilos.radioCirculo, usuario.sexo === 'M' && estilos.radioSelecionado]} />
          <Text>Masculino</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={estilos.radioBotao}
          onPress={() => setUsuario({ ...usuario, sexo: 'F' })}
        >
          <View style={[estilos.radioCirculo, usuario.sexo === 'F' && estilos.radioSelecionado]} />
          <Text>Feminino</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={estilos.input}
        placeholder="E-mail"
        value={usuario.email}
        onChangeText={(text) => setUsuario({ ...usuario, email: text })}
        autoCapitalize="none"
      />
      <TextInput
        style={estilos.input}
        placeholder="Telefone"
        value={usuario.telefone}
        onChangeText={(text) => setUsuario({ ...usuario, telefone: text })}
      />
      <TextInput
        style={estilos.input}
        placeholder="Senha"
        value={usuario.senha}
        onChangeText={(text) => setUsuario({ ...usuario, senha: text })}
        secureTextEntry
      />

      <View style={estilos.radioContainer}>
        <Text>Tipo de usuário:</Text>
        <TouchableOpacity
          style={estilos.radioBotao}
          onPress={() => setUsuario({ ...usuario, tipo_usuario: 'administrador' })}
        >
          <View style={[estilos.radioCirculo, usuario.tipo_usuario === 'administrador' && estilos.radioSelecionado]} />
          <Text>Administrador</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={estilos.radioBotao}
          onPress={() => setUsuario({ ...usuario, tipo_usuario: 'usuario' })}
        >
          <View style={[estilos.radioCirculo, usuario.tipo_usuario === 'usuario' && estilos.radioSelecionado]} />
          <Text>Usuário</Text>
        </TouchableOpacity>
      </View>

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
  logo: {
    width: 180,
    height: 180,
    alignSelf: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
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
    fontWeight: 'bold',
  },
});

// Exportação da tela de edição de usuários
export default EditarUsuario;
