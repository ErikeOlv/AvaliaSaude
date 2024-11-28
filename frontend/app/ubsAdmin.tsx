import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

// Variáveis de estado
const UBSAdmin = () => {
  const [ubs, setUbs] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [filtroAtivos, setFiltroAtivos] = useState('ativos');
  const apiUrlListar = 'http://10.0.2.2:8080/avaliasaude/api/ubs/'; // URL da API de visualização de UBS
  const router = useRouter();

  // Método para chamada de funções antes da renderização da tela
  useEffect(() => {
    carregarUbs();
  }, [filtroAtivos]); 

  // Função para carregar as UBS com base no filtro (ativas ou inativas)
  const carregarUbs = () => {
    let url = `${apiUrlListar}${filtroAtivos === 'ativos' ? '' : 'inativo'}`;

    // Método axios para envio e recebimento de informações da API UBS
    axios
      .get(url)
      .then((response) => {
        setUbs(response.data); 
      })
      .catch((error) => {
        Alert.alert('Erro', 'Não foi possível carregar as UBS.');
      });
  };

  // Função para excluir a UBS
  const deleteUbs = (id) => {
    axios
      .delete(`http://10.0.2.2:8080/avaliasaude/api/ubs/delete/${id}`) // Chamada da API para exclusão de uma UBS
      .then((response) => {
        Alert.alert('Sucesso', 'UBS removida com sucesso.');
        carregarUbs(); // Recarrega as UBS após a exclusão
      })
      .catch((error) => {
        Alert.alert('Erro', 'Não foi possível remover a UBS.');
      });
  };

  // Função para ativar a UBS
  const ativarUbs = (id) => {
    axios
      .put(`http://10.0.2.2:8080/avaliasaude/api/ubs/ativar/${id}`) // Chamada da API para ativação de uma UBS
      .then((response) => {
        Alert.alert('Sucesso', 'UBS ativada com sucesso.');
        carregarUbs(); // Recarrega as UBS após ativação
      })
      .catch((error) => {
        Alert.alert('Erro', 'Não foi possível ativar a UBS.');
      });
  };

  // Função para renderizar o card de cada UBS
  const renderUbs = ({ item }) => (
    <View style={estilos.card}>
      <View style={estilos.idContainer}>
        <Text style={estilos.idTexto}>{item.id}</Text>
      </View>
      <View style={estilos.infoContainer}>
        <Text style={estilos.texto}><Text style={estilos.label}>Nome:</Text> {item.nome}</Text>
        <Text style={estilos.texto}><Text style={estilos.label}>Endereço:</Text> {item.logradouro}, {item.numero} - {item.bairro}, {item.cidade} - {item.estado}</Text>
        <Text style={estilos.texto}><Text style={estilos.label}>CEP:</Text> {item.cep}</Text>
        <Text style={estilos.texto}><Text style={estilos.label}>Status:</Text> {item.ativo ? 'Ativa' : 'Inativa'}</Text>
      </View>

      <View style={estilos.botoesContainer}>
        {item.ativo && (
          <TouchableOpacity
            style={[estilos.botao, estilos.botaoEditar]}
            onPress={() => router.push(`/editarUbs?id=${item.id}`)}
          >
            <Text style={estilos.botaoTexto}>Editar</Text>
          </TouchableOpacity>
        )}

        {item.ativo ? (
          <TouchableOpacity
            style={[estilos.botao, estilos.botaoRemover]}
            onPress={() => deleteUbs(item.id)}
          >
            <Text style={estilos.botaoTexto}>Remover</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[estilos.botao, estilos.botaoEditar]}
            onPress={() => ativarUbs(item.id)}
          >
            <Text style={estilos.botaoTexto}>Ativar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Filtrando as UBS com base na pesquisa
  const ubsFiltradas = ubs.filter(
    (ubs) =>
      (ubs.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        ubs.cidade.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        ubs.cep.includes(termoPesquisa))
  );

  // Containers e objetos de estilo
  return (
    <View style={estilos.container}>
      <TextInput
        style={estilos.barraPesquisa}
        placeholder="Pesquisar por nome, cidade ou CEP"
        value={termoPesquisa}
        onChangeText={setTermoPesquisa}
      />

      <View style={estilos.filtroContainer}>
        <Text style={estilos.filtroTexto}>Filtrar por status:</Text>
        <TouchableOpacity
          style={[estilos.botaoFiltro, filtroAtivos === 'ativos' && estilos.botaoFiltroAtivo]}
          onPress={() => setFiltroAtivos('ativos')}
        >
          <Text style={estilos.botaoTexto}>Ativas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.botaoFiltro, filtroAtivos === 'inativos' && estilos.botaoFiltroAtivo]}
          onPress={() => setFiltroAtivos('inativos')}
        >
          <Text style={estilos.botaoTexto}>Inativas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={estilos.botaoAdicionar}
          onPress={() => router.push('/cadastroUbs')}
        >
          <Text style={estilos.botaoTexto}>Adicionar UBS</Text>
        </TouchableOpacity>
      </View>

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

// Exportação da tela de administração de UBS
export default UBSAdmin;
