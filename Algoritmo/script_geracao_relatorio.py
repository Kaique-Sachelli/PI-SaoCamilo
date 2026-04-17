from fpdf import FPDF

# 1. Criar a classe do PDF (opcional, mas bom para Cabeçalhos e Rodapés)
class MeuPDF(FPDF):
    def header(self):
        self.set_font("Arial", "B", 12)
        self.cell(0, 10, "Relatório de Vendas Mensal", border=True, ln=True, align="C")
        self.ln(10) # Pula uma linha

    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 8)
        self.cell(0, 10, f"Página {self.page_no()}", align="C")

# 2. Seus dados
dados = [
    {"produto": "Teclado Mecânico", "qtd": 15, "preco": 250.00},
    {"produto": "Mouse Gamer", "qtd": 30, "preco": 120.00},
    {"produto": "Monitor 144hz", "qtd": 5, "preco": 1200.00},
]

# 3. Gerar o PDF
pdf = MeuPDF()
pdf.add_page()
pdf.set_font("Arial", size=12)

# Adicionando os dados no PDF
pdf.cell(0, 10, "Lista de Produtos Vendidos:", ln=True)
pdf.ln(5)

# Criando um cabeçalho de tabela simples
pdf.set_font("Arial", "B", 12)
pdf.cell(80, 10, "Produto", border=1)
pdf.cell(40, 10, "Quantidade", border=1)
pdf.cell(40, 10, "Preço Unit.", border=1, ln=True)

# Preenchendo a tabela
pdf.set_font("Arial", size=12)
for item in dados:
    pdf.cell(80, 10, item["produto"], border=1)
    pdf.cell(40, 10, str(item["qtd"]), border=1)
    pdf.cell(40, 10, f"R$ {item['preco']:.2f}", border=1, ln=True)

# 4. Salvar o arquivo
pdf.output("meu_relatorio.pdf")
print("PDF gerado com sucesso!")