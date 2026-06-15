import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Usuario = {
  id_usuario: number;
  nome: string;
  email: string;
  tipo_perfil: string;
  situacao: string;
  data_nascimento: string;
  telefone: string;
  registro: string;
};

type UserContextType = {
  usuario: Usuario | null;
  carregando: boolean;
  login: (usuario: Usuario) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('usuario').then(json => {
      if (json) setUsuario(JSON.parse(json));
      setCarregando(false);
    });
  }, []);

  const login = (dadosUsuario: Usuario) => {
    setUsuario(dadosUsuario);
    AsyncStorage.setItem('usuario', JSON.stringify(dadosUsuario));
  };

  const logout = () => {
    setUsuario(null);
    AsyncStorage.removeItem('usuario');
  };

  return (
    <UserContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser deve ser usado dentro de UserProvider');
  return context;
}
