# PI-SaoCamilo: Nutri-Esportiva

> **Projeto Integrador:** Aplicativo e Aplicação Web para Avaliação da Taxa de Sudorese e Suporte à Tomada de Decisão em Hidratação de Atletas.

---

## 📌 Sobre o Projeto
Este projeto visa otimizar o monitoramento do balanço hídrico de atletas, permitindo recomendações individualizadas de ingestão de fluidos e eletrólitos. O sistema utiliza dados de massa corporal, condições ambientais e ingestão de líquidos para calcular a taxa de sudorese e prevenir riscos de desidratação ou hiperidratação.

## 🎯 Objetivos Centrais
* **Padronizar** a coleta de dados de perda hídrica.
* **Reduzir** erros de cálculo em campo.
* **Gerar** relatórios detalhados por sessão e por atleta.
* **Apoiar** a tomada de decisão nutricional com base no contexto ambiental e individual.

---

## 🚀 Funcionalidades Principais

### 1. Coleta de Dados Padronizada
* **Pré-sessão:** Massa corporal, condições ambientais, estado basal (cor da urina, sede) e histórico.
* **Durante a Sessão:** Registro de ingestão de fluidos e alimentos, além de volume urinário.
* **Pós-sessão:** Massa corporal pós-exercício, registro de sintomas e fadiga.

### 2. Motor de Cálculo
* Taxa de Sudorese Estimada ($L/h$).
* Percentual de Variação de Massa Corporal (Delta de Massa).
* Balanço Hídrico da Sessão.
* Recomendações de fracionamento de ingestão (Ex: a cada 15-20 min).

### 3. Relatórios e Exportação
* Geração de PDF e Planilhas para análise externa.
* Painel longitudinal com médias, medianas e variabilidade por clima/treino.

### 4. Segurança e Governança
* Controle de acesso por perfil (Atleta, Nutricionista, Treinador, Médico).
* Criptografia de dados e logs de auditoria para conformidade ética.

---

## 🛠 Componentes Tecnológicos
* **Aplicativo Multiplataforma:** Focado no uso em campo pelo atleta (com modo offline).
* **Painel Web:** Focado na gestão de dados e análise pela equipe de suporte e nutrição.
* **Integrações:** Suporte opcional para *Wearables* e APIs de Clima.
* **Triagem de Risco:** Módulo para detecção de sinais de Hiponatremia e desidratação severa.

### Stack Tecnológica (Sugestão)
| Camada | Tecnologia |
| :--- | :--- |
| **Frontend Mobile** | Flutter |
| **Frontend Web** | HTML / CSS / JavaScript |
| **Backend** | Node.js |
| **Banco de Dados** | MySQL |
| **Algoritmo (Motor de Cálculo)** | Python |

---

## 📅 Plano de Desenvolvimento
1.  **Fase 1:** Protótipo funcional e automação dos algoritmos de cálculo.
2.  **Fase 2:** Estudo piloto de usabilidade e coleta de feedback de usuários.
3.  **Fase 3:** Validação de consistência de dados e testes de variabilidade.
4.  **Fase 4:** Implementação em campo, dashboards de equipe e refinamento final.

---

## 👥 Autores
**Grupo do Projeto Integrador – 1º Semestre 2026**

* Gabriel Lippi
* Pedro
* Gustavo
* Kaique
* Nycholas

**Instituições:** Centro Universitário São Camilo | Instituto Mauá de Tecnologia.