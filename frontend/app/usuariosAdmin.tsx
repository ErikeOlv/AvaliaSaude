import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

// Variáveis de estado
const UsuariosAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [filtroAtivos, setFiltroAtivos] = useState('ativos');
  const apiUrlListar = 'http://10.0.2.2:8080/avaliasaude/api/usuario/'; // URL da API de usuários
  const router = useRouter();

  // Função para carregamento de outras funções antes da renderização da tela 
  useEffect(() => {
    carregarUsuarios();
  }, [filtroAtivos]); 

  // Função para carregar os usuários com base no filtro (ativos ou inativos)
  const carregarUsuarios = () => {
    let url = `${apiUrlListar}${filtroAtivos === 'ativos' ? '' : 'inativo'}`;

    // Método axios para envio e recebimento de informações da API usuário
    axios
      .get(url)
      .then((response) => {
        setUsuarios(response.data); 
      })
      .catch((error) => {
        Alert.alert('Erro', 'Não foi possível carregar os usuários.');
      });
  };

  // Função para excluir o usuário
  const deleteUser = (id) => {
    axios
      .delete(`http://10.0.2.2:8080/avaliasaude/api/usuario/delete/${id}`) // Chamada da API de exclusão de usuário
      .then((response) => {
        Alert.alert('Sucesso', 'Usuário removido com sucesso.');
        carregarUsuarios(); // Recarrega os usuários após a exclusão
      })
      .catch((error) => {
        Alert.alert('Erro', 'Não foi possível remover o usuário.');
      });
  };

  // Função para ativar o usuário
  const ativarUsuario = (id) => {
    axios
      .put(`http://10.0.2.2:8080/avaliasaude/api/usuario/ativar/${id}`) // Chamada da API de ativação de usuário
      .then((response) => {
        Alert.alert('Sucesso', 'Usuário ativado com sucesso.');
        carregarUsuarios(); // Recarrega os usuários após ativação
      })
      .catch((error) => {
        Alert.alert('Erro', 'Não foi possível ativar o usuário.');
      });
  };

  // Função para renderizar o card de cada usuário
  const renderUsuario = ({ item }) => (
    <View style={estilos.card}>
      <View style={estilos.idContainer}>
        <Text style={estilos.idTexto}>{item.id}</Text>
      </View>
      <View style={estilos.infoContainer}>
        <Text style={estilos.texto}><Text style={estilos.label}>Nome:</Text> {item.nome}</Text>
        <Text style={estilos.texto}><Text style={estilos.label}>CPF:</Text> {item.cpf}</Text>
        <Text style={estilos.texto}><Text style={estilos.label}>Email:</Text> {item.email}</Text>
        <Text style={estilos.texto}><Text style={estilos.label}>Status:</Text> {item.ativo ? 'Ativo' : 'Inativo'}</Text>
      </View>

      <View style={estilos.botoesContainer}>
        {item.ativo && (
          <TouchableOpacity
            style={[estilos.botao, estilos.botaoEditar]}
            onPress={() => router.push(`/editarUsuario?id=${item.id}`)}
          >
            <Text style={estilos.botaoTexto}>Editar</Text>
          </TouchableOpacity>
        )}

        {item.ativo ? (
          <TouchableOpacity
            style={[estilos.botao, estilos.botaoRemover]}
            onPress={() => deleteUser(item.id)}
          >
            <Text style={estilos.botaoTexto}>Remover</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[estilos.botao, estilos.botaoEditar]}
            onPress={() => ativarUsuario(item.id)}
          >
            <Text style={estilos.botaoTexto}>Ativar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Filtrando os usuários com base na pesquisa
  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      (usuario.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        usuario.email.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        usuario.cpf.includes(termoPesquisa))
  );

  // Containers e objetos de estilo
  return (
    <View style={estilos.container}>
      <TextInput
        style={estilos.barraPesquisa}
        placeholder="Pesquisar por nome, CPF ou email"
        value={termoPesquisa}
        onChangeText={setTermoPesquisa}
      />

      <View style={estilos.filtroContainer}>
        <Text style={estilos.filtroTexto}>Filtrar por status:</Text>
        <TouchableOpacity
          style={[estilos.botaoFiltro, filtroAtivos === 'ativos' && estilos.botaoFiltroAtivo]}
          onPress={() => setFiltroAtivos('ativos')}
        >
          <Text style={estilos.botaoTexto}>Ativos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.botaoFiltro, filtroAtivos === 'inativos' && estilos.botaoFiltroAtivo]}
          onPress={() => setFiltroAtivos('inativos')}
        >
          <Text style={estilos.botaoTexto}>Inativos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={estilos.botaoAdicionar}
          onPress={() => router.push('/cadastroAdmin')}
        >
          <Text style={estilos.botaoTexto}>Adicionar usuário</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={usuariosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUsuario}
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
    paddingBottom: 20,
  },
  barraPesquisa: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  filtroContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filtroTexto: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  botaoFiltro: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#a6acaf',
  },
  botaoFiltroAtivo: {
    backgroundColor: '#049434',
  },
  botaoAdicionar: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#fcc404',
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
  idContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
  },
  idTexto: {
    fontWeight: 'bold',
    color: '#000',
  },
  infoContainer: {
    flex: 1,
  },
  texto: {
    fontSize: 14,
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  botao: {
    padding: 8,
    borderRadius: 5,
  },
  botaoEditar: {
    backgroundColor: '#049434',
    marginRight: 5,
  },
  botaoRemover: {
    backgroundColor: '#DC143C',
  },
  botaoTexto: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

// Exportação da tela de administração de usuários
export default UsuariosAdmin;
