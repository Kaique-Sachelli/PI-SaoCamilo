from fpdf import FPDF
import datetime

class RelatorioAtleta(FPDF):
    def header(self):
        dir_logos = r"C:\Users\Dell\OneDrive\Documentos\PI-SaoCamilo\Algoritmo\logo_instituicoes"
        
        try:
            self.image(f"{dir_logos}/logo_maua.png", x=75, y=8, w=25)
            self.image(f"{dir_logos}/logo_sao_camilo.jpg", x=110, y=8, w=25)
        except:
            pass 
        
        self.ln(30)

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

pdf.add_page()

pdf.set_font("helvetica", "B", 24)
pdf.set_text_color(0, 0, 128) 
pdf.ln(20)
pdf.multi_cell(0, 15, "Relatório de Hidratação e\nPerformance Humana", align="C")

pdf.ln(30)
pdf.set_font("helvetica", "B", 18)
pdf.set_text_color(50)
pdf.cell(0, 10, "Atleta: Nome do Atleta Exemplo", align="C", ln=True)
pdf.set_draw_color(200)
pdf.line(60, pdf.get_y() + 2, 150, pdf.get_y() + 2)

pdf.add_page()
pdf.set_font("helvetica", "B", 16)
pdf.cell(0, 10, "Sumário", ln=True)
pdf.ln(5)
pdf.set_font("helvetica", size=11)

secoes = [
    ("Contexto da Sessão", 3),
    ("O Motor de Cálculo", 4),
    ("Resultados e Análise", 5),
    ("Recomendação e Observações", 6)
]

for texto, pag in secoes:
    pdf.cell(170, 10, texto, border=0)
    pdf.cell(0, 10, f"........ {pag:02d}", ln=True, align="R")

pdf.add_page()
pdf.criar_secao("3. Contexto da Sessão")

pdf.set_font("helvetica", "B", 11)
pdf.cell(0, 10, "Dados Biométricos:", ln=True)
pdf.set_font("helvetica", size=10)
pdf.cell(45, 8, "Peso Pré: 80.5 kg", border="B")
pdf.cell(45, 8, "Peso Pós: 79.2 kg", border="B")
pdf.cell(45, 8, "Altura: 1.80 m", border="B")
pdf.cell(45, 8, "Idade: 25 anos", border="B", ln=True)

pdf.ln(10)

pdf.set_fill_color(240, 240, 240)
pdf.rect(10, pdf.get_y(), 190, 20, "F")
pdf.set_font("helvetica", "B", 10)
pdf.cell(63, 20, " Temp: 28°C", align="C")
pdf.cell(63, 20, " Umidade: 65%", align="C")
pdf.cell(63, 20, " Vento: 12 km/h", align="C", ln=True)

pdf.ln(10)
pdf.criar_secao("4. O Motor de Cálculo")
pdf.set_fill_color(245, 245, 245)
pdf.set_font("courier", size=10) 
formula = """
Taxa de Sudorese (L/h) = [Massa Pré(g) - Massa Pós(g) + Ingestão(ml) - Urina(ml)] 
                         ------------------------------------------------------
                                         Tempo de Treino (min) / 60
"""
pdf.multi_cell(0, 8, formula, border=1, fill=True, align="C")
pdf.add_page()
pdf.criar_secao("5. Resultados e Análise")

pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 10, "TAXA DE SUDORESE:", align="C", ln=True)
pdf.set_font("helvetica", "B", 40)
pdf.set_text_color(0, 0, 128)
pdf.cell(0, 25, "1.4 L/h", align="C", ln=True)
pdf.set_text_color(0)

variacao = 1.6 # Exemplo: 1.6%
pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 10, f"Variação de Massa Corporal: {variacao}%", ln=True)

if variacao < 2:
    pdf.set_fill_color(144, 238, 144) # Verde
    status = "VERDE: Perda esperada."
elif variacao <= 3:
    pdf.set_fill_color(255, 255, 153) # Amarelo
    status = "AMARELO: Risco de performance."
else:
    pdf.set_fill_color(255, 153, 153) # Vermelho
    status = "VERMELHO: Risco de desidratação."

pdf.cell(0, 10, status, fill=True, ln=True, align="C")

pdf.ln(10)
pdf.criar_secao("6. Recomendações e Observações")

pdf.set_font("helvetica", "B", 11)
pdf.set_text_color(200, 0, 0)
pdf.cell(0, 10, "!!! ALERTA DE SEGURANÇA", ln=True)
pdf.set_text_color(0)
pdf.set_font("helvetica", size=10)
pdf.multi_cell(0, 7, "* Ingerir 500ml de água com eletrólitos na próxima hora.\n* Evitar treinos em horários de pico térmico hoje.")

pdf.ln(20)
pdf.cell(0, 10, "." * 60, align="C", ln=True)
pdf.set_font("helvetica", "I", 9)
pdf.cell(0, 5, "Assinatura do Responsável Técnico", align="C")

pdf.output("relatorio_tecnico_atleta.pdf")
print("Relatório Profissional Gerado!")