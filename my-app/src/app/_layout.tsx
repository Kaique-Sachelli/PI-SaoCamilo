import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { UserProvider, useUser } from '../context/UserContext';

function NavegacaoRaiz() {
  const { usuario, carregando } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (carregando) return;
    if (!usuario) return;

    // redireiciona o usuário de acordo com o papel do usuario no aplicativo
    if (usuario.tipo_perfil === 'Atleta') router.replace('/homepage_atleta');
    else if (usuario.tipo_perfil === 'Nutricionista') router.replace('/homepage_nutricionista');
    else if (usuario.tipo_perfil === 'Treinador') router.replace('/homepage_treinador');
    else if (usuario.tipo_perfil === 'Medico') router.replace('/homepage_medico');
    else router.replace('/homepage_adm');
  }, [usuario, carregando]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
        animation: 'none',
        animationDuration: 150,
      }}
      initialRouteName="login"
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="recuperar_senha" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <UserProvider>
      <NavegacaoRaiz />
    </UserProvider>
  );
}
