from fpdf import FPDF

pdf = FPDF()
pdf.add_page()
pdf.set_font('Arial', '', 12)

with open('prompts_IA.txt', encoding='utf-8') as f:
    for line in f:
        if line.strip() == '':
            pdf.ln(5)
        else:
            pdf.multi_cell(0, 10, line.strip())

pdf.output('prompts_IA.pdf')
print('PDF generado: prompts_IA.pdf')
