from fpdf import FPDF

def create_pdf(content, filename):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_font("Helvetica", size=11)

    for line in content.split("\n"):
        safe_line = line.encode("latin-1", errors="replace").decode("latin-1")
        pdf.multi_cell(0, 7, safe_line)

    pdf.output(filename)
    return filename
