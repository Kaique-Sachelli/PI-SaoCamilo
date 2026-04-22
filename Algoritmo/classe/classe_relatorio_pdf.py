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