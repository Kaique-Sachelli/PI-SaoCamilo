from fpdf import FPDF
import datetime
import os

class RelatorioAtleta(FPDF):

    def header(self):
        if self.page == 1:
            dir_logos = r"C:\Users\25.01686-6\Documents\PI-SaoCamilo\Algoritmo\logo_instituicoes"
            
            logo_maua = os.path.join(dir_logos, "logo_instituto_maua_tecnologia.png")
            logo_camilo = os.path.join(dir_logos, "logo_centro_universitario_sao_camilo.jpg")

            if os.path.exists(logo_maua):
                self.image(logo_maua, x=70, y=10, w=30)

            if os.path.exists(logo_camilo):
                self.image(logo_camilo, x=110, y=10, w=30)

            self.ln(60)

    def footer(self):
        self.set_y(-20)
        self.set_font("helvetica", "I", 8)
        self.set_text_color(100)

        data_atual = datetime.datetime.now().strftime("%d/%m/%Y")
        texto_footer = f"Data: {data_atual}  |  Lat: -23.6489  |  Long: -46.5742  |  Página {self.page_no()}"
        self.cell(0, 10, texto_footer, align="C")

    def criar_secao(self, titulo):
        self.set_font("helvetica", "B", 14)
        self.set_text_color(0, 0, 128)
        self.cell(0, 10, titulo, ln=True)

        self.set_draw_color(0, 0, 128)
        self.line(self.get_x(), self.get_y(), self.get_x() + 190, self.get_y())
        self.ln(5)
        self.set_text_color(0)


pdf = RelatorioAtleta()
pdf.set_auto_page_break(auto=True, margin=15)

# =========================
# CAPA
# =========================
pdf.add_page()

pdf.set_font("helvetica", "B", 24)
pdf.set_text_color(0, 0, 128)
pdf.ln(20)
pdf.multi_cell(0, 15, "Relatório de Hidratação e\nPerformance do Atleta", align="C")

pdf.ln(30)
pdf.set_font("helvetica", "B", 18)
pdf.set_text_color(50)
pdf.cell(0, 10, "Atleta: Nome do Atleta Exemplo", align="C", ln=True)
pdf.set_draw_color(200)
pdf.line(60, pdf.get_y() + 2, 150, pdf.get_y() + 2)
pdf.ln(20)
pdf.cell(0, 10, "Nutricionista: Nome do Nutricionista Exemplo", align="C", ln=True)
pdf.set_draw_color(200)
pdf.line(60, pdf.get_y() + 2, 150, pdf.get_y() + 2)
pdf.ln(20)
pdf.cell(0, 10, "Treinador: Nome do Treinador Exemplo", align="C", ln=True)

pdf.set_draw_color(200)
pdf.line(60, pdf.get_y() + 2, 150, pdf.get_y() + 2)


# =========================
# SUMÁRIO
# =========================
pdf.add_page()

pdf.set_font("helvetica", "B", 16)
pdf.cell(0, 10, "Sumário", ln=True)

pdf.ln(5)
pdf.set_font("helvetica", size=11)

secoes = [
    ("Capa do Relatório", 1),
    ("Sumário", 2),
    ("Contexto da Sessão", 3),
    ("O Motor de Cálculo", 4),
    ("Resultados e Análise", 5),
    ("Recomendações e Observações", 6)
]

for texto, pag in secoes:
    pdf.cell(170, 10, texto)
    pdf.cell(0, 10, f"........ {pag:02d}", ln=True, align="R")


# =========================
# CONTEXTO DA SESSÃO
# =========================
pdf.add_page()
pdf.criar_secao("3. Contexto da Sessão")

# Card azul
pdf.set_fill_color(230, 240, 255)
pdf.set_draw_color(0, 0, 128)
pdf.rect(10, pdf.get_y(), 190, 35, "DF")

pdf.set_font("helvetica", "B", 11)

y_base = pdf.get_y()

pdf.set_xy(15, y_base + 5)
pdf.cell(60, 8, "Peso Pré: 80.5 kg")

pdf.set_xy(75, y_base + 5)
pdf.cell(60, 8, "Peso Pós: 79.2 kg")

pdf.set_xy(135, y_base + 5)
pdf.cell(60, 8, "Altura: 1.80 m")

pdf.set_xy(15, y_base + 18)
pdf.cell(60, 8, "Idade: 25 anos")

pdf.ln(40)

# Clima
pdf.set_fill_color(255, 248, 220)
pdf.rect(10, pdf.get_y(), 190, 15, "F")

pdf.set_font("helvetica", "B", 10)
pdf.cell(63, 15, "Temp: 28°C", align="C")
pdf.cell(63, 15, "Umidade: 65%", align="C")
pdf.cell(63, 15, "Vento: 12 km/h", align="C", ln=True)


# =========================
# MOTOR DE CÁLCULO
# =========================
pdf.ln(10)
pdf.criar_secao("4. O Motor de Cálculo")

formula1 = """Perda de Massa Corporal ajustada =
(Massa Pré-corporal(kg) - Massa Pós-corporal(kg)) + Ingestão de Fluídos(ml) - Volume Urinário(ml)
"""

formula2 = """Taxa de Sudorese (L/h) =
Perda de Massa Corporal ajustada ÷ Tempo(m)
"""

formula3 = """Percentual de Variação de Massa(%) =
((Massa Pós-corporal(kg) - Massa Pós-corporal(kg)) ÷ Massa Pós-corporal(kg)) x 100
"""

def bloco_formula(titulo, texto):
    pdf.set_font("helvetica", "B", 11)
    pdf.cell(0, 8, titulo, ln=True)

    pdf.set_font("courier", size=10)
    pdf.set_fill_color(245, 250, 255)
    pdf.multi_cell(0, 7, texto, border=1, fill=True)
    pdf.ln(4)

bloco_formula("Perda de Massa Corporal", formula1)
bloco_formula("Taxa de Sudorese", formula2)
bloco_formula("Variação Percentual", formula3)


# =========================
# RESULTADOS E ANÁLISE
# =========================
pdf.add_page()
pdf.criar_secao("5. Resultados e Análise")

variacao = 1.6

pdf.set_fill_color(230, 255, 230)
pdf.rect(10, pdf.get_y(), 190, 50, "F")

pdf.set_font("helvetica", "B", 14)
pdf.cell(0, 10, "TAXA DE SUDORESE", align="C", ln=True)

pdf.set_font("helvetica", "B", 36)
pdf.set_text_color(0, 102, 0)
pdf.cell(0, 20, "1.4 L/h", align="C", ln=True)

pdf.set_text_color(0)
pdf.set_font("helvetica", size=12)
pdf.cell(0, 10, f"Variação de Massa: {variacao}%", align="C", ln=True)

if variacao < 2:
    cor = (0, 150, 0)
    status = "Hidratação adequada"
elif variacao <= 3:
    cor = (200, 150, 0)
    status = "Atenção à hidratação"
else:
    cor = (200, 0, 0)
    status = "Risco de desidratação"

pdf.set_text_color(*cor)
pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 10, status, align="C", ln=True)

pdf.set_text_color(0)
pdf.ln(10)


# =========================
# RECOMENDAÇÕES E OBSERVAÇÕES
# =========================
pdf.criar_secao("6. Recomendações e Observações")

pdf.set_fill_color(255, 235, 235)
pdf.rect(10, pdf.get_y(), 190, 40, "F")

pdf.set_font("helvetica", "B", 12)
pdf.set_text_color(180, 0, 0)
pdf.cell(0, 10, "ALERTA DE SEGURANÇA", ln=True)

pdf.set_text_color(0)
pdf.set_font("helvetica", size=11)

pdf.multi_cell(0, 8,
    "- Ingerir 500ml de água com eletrólitos na próxima hora.\n"
    "- Evitar treinos em horários de pico térmico.\n"
    "- Monitorar sinais de fadiga ou tontura."
)

pdf.ln(20)

# Assinatura
pdf.cell(0, 10, "_" * 60, align="C", ln=True)
pdf.set_font("helvetica", "I", 9)
pdf.cell(0, 5, "Assinatura do Responsável Técnico", align="C")


# =========================
# OUTPUT
# =========================
pdf.output("relatorio_tecnico_atleta.pdf")
print("Relatório Profissional Gerado!")