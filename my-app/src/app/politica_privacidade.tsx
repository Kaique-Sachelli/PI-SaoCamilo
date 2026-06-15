import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const SECOES = [
  {
    titulo: 'PARTE I — TERMOS DE USO',
    tipo: 'parte',
  },
  {
    titulo: '1. Aceitação dos Termos',
    tipo: 'secao',
    texto:
      'Estes Termos de Uso ("Termos") regulam o acesso e a utilização do aplicativo São Camilo – Nutri-Esportiva ("Aplicativo" ou "Plataforma").\n\nAo criar uma conta, acessar ou utilizar a Plataforma, você declara que leu, compreendeu e concorda integralmente com estes Termos e com a Política de Privacidade. Caso não concorde, não utilize o Aplicativo.',
  },
  {
    titulo: '2. Definições',
    tipo: 'secao',
    texto:
      '• Plataforma / Aplicativo: a solução multiplataforma São Camilo – Nutri-Esportiva.\n• Usuário: toda pessoa que acessa a Plataforma, em qualquer perfil de acesso.\n• Atleta: usuário que registra dados de massa corporal, hidratação, sintomas e demais informações de monitoramento.\n• Profissional: nutricionista, treinador ou médico que acompanha atletas vinculados ao seu perfil.\n• Administrador / Suporte: usuários responsáveis pela gestão de contas, permissões e atendimento.\n• Conteúdo do Usuário: dados, textos, medidas, fotos, exames e arquivos inseridos pelo Usuário na Plataforma.',
  },
  {
    titulo: '3. Descrição do Serviço',
    tipo: 'secao',
    texto:
      'A Plataforma destina-se ao monitoramento do balanço hídrico de atletas e ao suporte à tomada de decisão nutricional. Entre suas funcionalidades estão:\n\n• Fluxo de coleta guiada de dados (pré-sessão, durante e pós-sessão de treino);\n• Cálculo automatizado de perda de massa corporal ajustada, balanço hídrico e Taxa de Sudorese Estimada (L/h);\n• Triagem de risco e alertas de hipo-hidratação ou ingestão excessiva de líquidos;\n• Registro de diário alimentar, sintomas, qualidade do sono e humor;\n• Upload e armazenamento de exames e medidas antropométricas;\n• Geração e exportação de relatórios longitudinais em PDF e planilha;\n• Operação parcial em modo offline com posterior sincronização.',
  },
  {
    titulo: '4. Natureza do Projeto e Limitações',
    tipo: 'secao',
    texto:
      'Caráter acadêmico. A Plataforma é desenvolvida no âmbito de um Projeto Integrador Interdisciplinar, em parceria com o Hospital São Camilo.\n\nNão substitui orientação profissional. As estimativas, alertas e relatórios da Plataforma têm finalidade informativa e de apoio. Não constituem diagnóstico, prescrição ou intervenção médica ou nutricional, e não substituem a avaliação de profissionais de saúde habilitados.',
  },
  {
    titulo: '5. Cadastro, Conta e Perfis de Acesso',
    tipo: 'secao',
    texto:
      'O uso das funcionalidades exige cadastro com informações verdadeiras, completas e atualizadas. O acesso é controlado por perfis com diferentes níveis de permissão.\n\n• O Usuário é responsável por manter a confidencialidade de suas credenciais;\n• Profissionais acessam somente os dados dos atletas a eles vinculados;\n• É vedado compartilhar credenciais, criar contas falsas ou acessar dados de terceiros sem autorização;\n• Notifique imediatamente o suporte em caso de uso não autorizado da conta.',
  },
  {
    titulo: '6. Elegibilidade e Uso por Menores de Idade',
    tipo: 'secao',
    texto:
      'O uso por menores de 18 anos somente é permitido mediante consentimento e supervisão de pelo menos um dos pais ou do responsável legal, que será co-responsável pelo cumprimento destes Termos.',
  },
  {
    titulo: '7. Obrigações e Responsabilidades do Usuário',
    tipo: 'secao',
    texto:
      'Ao utilizar a Plataforma, o Usuário compromete-se a:\n\n• Fornecer dados precisos, especialmente medidas de massa corporal, ingestão de líquidos e sintomas;\n• Seguir os protocolos de padronização indicados;\n• Utilizar a Plataforma de forma lícita, ética e em conformidade com a legislação aplicável;\n• Não inserir dados de terceiros sem autorização nem conteúdo ilícito ou ofensivo.',
  },
  {
    titulo: '8. Condutas Vedadas',
    tipo: 'secao',
    texto:
      'É expressamente proibido:\n\n• Tentar acessar áreas, dados ou funcionalidades não autorizadas ao seu perfil;\n• Realizar engenharia reversa, copiar, modificar ou explorar comercialmente a Plataforma sem autorização;\n• Introduzir malware ou comprometer a segurança e a integridade dos dados;\n• Coletar dados de outros usuários de forma indevida.',
  },
  {
    titulo: '9. Conteúdo do Usuário',
    tipo: 'secao',
    texto:
      'O Usuário é o titular e responsável pelo Conteúdo que insere. Ao inserir tal Conteúdo, o Usuário autoriza seu tratamento pela Plataforma exclusivamente para as finalidades descritas na Política de Privacidade. A Plataforma não reivindica propriedade sobre o Conteúdo do Usuário.',
  },
  {
    titulo: '10. Propriedade Intelectual',
    tipo: 'secao',
    texto:
      'A Plataforma, suas marcas, layout, código-fonte, motor de cálculo, textos e demais elementos são protegidos por direitos de propriedade intelectual. É vedada qualquer utilização não autorizada.',
  },
  {
    titulo: '11. Disponibilidade, Modo Offline e Suspensão',
    tipo: 'secao',
    texto:
      'A Plataforma é fornecida "no estado em que se encontra", podendo haver interrupções para manutenção ou atualizações. O modo offline armazena dados localmente até a sincronização; até esse momento, os dados podem não estar refletidos no painel web.',
  },
  {
    titulo: '12. Limitação de Responsabilidade',
    tipo: 'secao',
    texto:
      'Na máxima extensão permitida pela legislação aplicável, a Plataforma não se responsabiliza por decisões tomadas exclusivamente com base nas estimativas e alertas gerados, por danos decorrentes de informações inexatas fornecidas pelo Usuário, por uso indevido das credenciais ou por indisponibilidades temporárias.',
  },
  {
    titulo: '13. Cancelamento e Exclusão de Conta',
    tipo: 'secao',
    texto:
      'O Usuário pode solicitar o encerramento de sua conta e a exclusão de seus dados a qualquer momento, observados os direitos previstos na Política de Privacidade e eventuais obrigações legais de guarda de registros.',
  },
  {
    titulo: '14. Alterações dos Termos',
    tipo: 'secao',
    texto:
      'Estes Termos podem ser atualizados a qualquer tempo. Alterações relevantes serão comunicadas pelos canais da Plataforma, e a data da última atualização será revisada no início deste documento.',
  },
  {
    titulo: '15. Legislação Aplicável e Foro',
    tipo: 'secao',
    texto:
      'Estes Termos são regidos pelas leis da República Federativa do Brasil, incluindo a Lei nº 13.709/2018 (LGPD), a Lei nº 12.965/2014 (Marco Civil da Internet) e, quando aplicável, a Lei nº 8.078/1990 (Código de Defesa do Consumidor).',
  },
  {
    titulo: 'PARTE II — POLÍTICA DE PRIVACIDADE',
    tipo: 'parte',
  },
  {
    titulo: '17. Nosso Compromisso',
    tipo: 'secao',
    texto:
      'Esta Política de Privacidade descreve como a Plataforma São Camilo – Nutri-Esportiva coleta, utiliza, compartilha, armazena e protege os dados pessoais dos Usuários, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – "LGPD").',
  },
  {
    titulo: '20. Dados que Coletamos',
    tipo: 'secao',
    texto:
      '• Dados cadastrais: nome, e-mail, senha (armazenada com hash), CPF/identificador, perfil de acesso.\n• Dados antropométricos: idade, sexo, altura, massa corporal, modalidade esportiva.\n• Dados sensíveis de saúde: massa corporal pré/pós-treino, cor de urina, ingestão de líquidos, taxa de sudorese, sintomas, diário alimentar e exames clínicos.\n• Dados de treino: data, duração, tipo de treino, condições ambientais.\n• Dados técnicos: histórico de login, logs de atividade, registros de acesso.',
  },
  {
    titulo: '24. Compartilhamento de Dados',
    tipo: 'secao',
    texto:
      'Os dados podem ser compartilhados com:\n\n• Profissionais vinculados ao atleta (nutricionista, treinador, médico);\n• Hospital São Camilo, como instituição parceira;\n• Operadores e prestadores de serviço sob obrigações de confidencialidade e segurança;\n• Autoridades públicas, quando exigido por lei ou ordem judicial.\n\nNão vendemos dados pessoais nem os utilizamos para publicidade de terceiros.',
  },
  {
    titulo: '25. Armazenamento e Segurança',
    tipo: 'secao',
    texto:
      'Adotamos medidas técnicas e administrativas para proteger os dados:\n\n• Criptografia de dados em trânsito e proteção de credenciais por hash forte;\n• Controle de acesso baseado em papéis;\n• Registro de logs de acesso e de atividades para auditoria;\n\nEm caso de incidente de segurança, comunicaremos os titulares e a ANPD nos termos da LGPD.',
  },
  {
    titulo: '28. Direitos do Titular',
    tipo: 'secao',
    texto:
      'Nos termos do art. 18 da LGPD, o titular pode requerer:\n\n• Confirmação da existência de tratamento e acesso aos dados;\n• Correção de dados incompletos, inexatos ou desatualizados;\n• Anonimização, bloqueio ou eliminação de dados desnecessários;\n• Portabilidade dos dados;\n• Eliminação dos dados tratados com base no consentimento;\n• Revogação do consentimento.',
  },
  {
    titulo: '31. Alterações desta Política',
    tipo: 'secao',
    texto:
      'Esta Política pode ser atualizada para refletir mudanças legais ou no funcionamento da Plataforma. Alterações relevantes serão comunicadas pelos canais oficiais.',
  },
  {
    titulo: '32. Encarregado e Contato',
    tipo: 'secao',
    texto:
      'Para dúvidas, solicitações ou reclamações sobre privacidade e proteção de dados, contate o Encarregado pelos canais oficiais da Plataforma. O titular também pode peticionar perante a Autoridade Nacional de Proteção de Dados (ANPD).',
  },
];

export function PoliticaPrivacidadeModal({ visible, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Cabeçalho */}
          <View style={styles.cabecalho}>
            <View>
              <Text style={styles.cabecalhoTitulo}>Termos de Uso</Text>
              <Text style={styles.cabecalhoSubtitulo}>e Política de Privacidade</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.fecharBtn}>
              <Text style={styles.fecharTexto}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.versao}>Versão 1.0 · Última atualização: 15/06/2026</Text>

          {/* Conteúdo */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {SECOES.map((s, i) => (
              <View key={i} style={s.tipo === 'parte' ? styles.parteWrap : styles.secaoWrap}>
                <Text style={s.tipo === 'parte' ? styles.parteTitulo : styles.secaoTitulo}>
                  {s.titulo}
                </Text>
                {s.texto ? <Text style={styles.secaoTexto}>{s.texto}</Text> : null}
              </View>
            ))}

            <Text style={styles.fim}>— Fim do documento —</Text>
          </ScrollView>

          {/* Botão fechar */}
          <TouchableOpacity style={styles.btnEntendido} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.btnEntendidoTexto}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const RED = '#B3151F';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 16,
    ...Platform.select({
      ios: { boxshadow: '0px -4px 20px rgba(0,0,0,0.15)' },
      android: { elevation: 16 },
      web: { boxshadow: '0px -4px 20px rgba(0,0,0,0.15)' },
    }),
  },

  // Cabeçalho
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  cabecalhoTitulo: { fontSize: 20, fontWeight: '700', color: '#111' },
  cabecalhoSubtitulo: { fontSize: 14, color: '#555', marginTop: 2 },
  fecharBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fecharTexto: { fontSize: 16, color: '#555', fontWeight: '600' },
  versao: { fontSize: 11, color: '#aaa', paddingHorizontal: 20, marginBottom: 8 },

  // Scroll
  scrollContent: { paddingHorizontal: 20, paddingBottom: 12, gap: 14 },

  // Parte (separador grande)
  parteWrap: {
    backgroundColor: RED,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 6,
  },
  parteTitulo: { fontSize: 14, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },

  // Seção
  secaoWrap: { gap: 6 },
  secaoTitulo: { fontSize: 14, fontWeight: '700', color: '#111' },
  secaoTexto: { fontSize: 13, color: '#444', lineHeight: 20 },

  fim: { fontSize: 12, color: '#aaa', textAlign: 'center', marginTop: 8 },

  // Botão
  btnEntendido: {
    backgroundColor: RED,
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnEntendidoTexto: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
