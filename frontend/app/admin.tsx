import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

// Função para formatação da data de login
const formatarDataHora = (data) => {
  const opcoes = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return data.toLocaleString('pt-BR', opcoes);
};

// Exportação da função principal
export default function Admin() {
  const router = useRouter();
  const [dataHoraAcesso, setDataHoraAcesso] = useState('');
  const [usuarioNome, setUsuarioNome] = useState(''); 

  // Função para carregamento de outras funções antes da renderização da tela 
  useEffect(() => {
    const data = new Date();
    setDataHoraAcesso(formatarDataHora(data));
    carregarUsuario(); 
  }, []);

  // Função para carregamento das variáveis globais
  const carregarUsuario = async () => {
    try {
      const nome = await SecureStore.getItemAsync('userName'); // Capta a variável global nome
      if (nome) {
        setUsuarioNome(nome);
      }
    } catch (error) {
      console.error('Erro ao carregar o nome do usuário', error);
    }
  };

  // Containers e objetos de estilo
  return (
    <View style={estilos.container}>
      <Image 
        source={require('@/assets/images/AvaliaSaudeLogo.png')} 
        style={estilos.logo}
      />
      
      <Text style={estilos.titulo}>Painel administrativo</Text>
      <Text style={estilos.informacoes}>{usuarioNome}</Text>
      <Text style={estilos.informacoes}>Acesso em: {dataHoraAcesso}</Text>

      <View style={estilos.logoContainer}>
        <TouchableOpacity
          style={[estilos.logoBotao, estilos.containerUsuario]}
          onPress={() => router.push('/usuariosAdmin')}
        >
          <Image 
            source={require('@/assets/images/usuario.png')} 
            style={estilos.logoOpcao}
          />
          <Text style={estilos.textoLogo}>Usuários</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[estilos.logoBotao, estilos.containerHospital]}
          onPress={() => router.push('/ubsAdmin')}
        >
          <Image 
            source={require('@/assets/images/hospital.png')} 
            style={estilos.logoOpcao}
          />
          <Text style={estilos.textoLogo}>UBS</Text>
        </TouchableOpacity>
      </View>

      <View style={estilos.logoContainer}>
        <TouchableOpacity 
          style={[estilos.logoBotao, estilos.containerApp]}
          onPress={() => router.push('/home')}
        >
          <Image 
            source={require('@/assets/images/app.png')} 
            style={estilos.logoOpcao}
          />
          <Text style={estilos.textoLogo}>App</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[estilos.logoBotao, estilos.containerVoltar]}
          onPress={() => router.push('/')}
        >
          <Image 
            source={require('@/assets/images/voltar.png')} 
            style={estilos.logoOpcao}
          />
          <Text style={estilos.textoLogo}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Estilos
const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 170,
    height: 170,
    alignSelf: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  informacoes: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    marginBottom: 5,
  },
  logoContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  logoBotao: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    padding: 20,
    width: 115,
    height: 115,
  },
  containerUsuario: {
    backgroundColor: '#049434',
  },
  containerHospital: {
    backgroundColor: '#2c1374',
  },
  containerApp: {
    backgroundColor: '#fcc404',
  },
  containerVoltar: {
    backgroundColor: '#DC143C',
  },
  logoOpcao: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  textoLogo: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
  },
});
