from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
import markdown

# Read Markdown
with open('frontend-spec.md', 'r', encoding='utf-8') as f:
    md_content = f.read()

# Convert to HTML
html = markdown.markdown(md_content)

doc = SimpleDocTemplate("frontend-spec.pdf", pagesize=letter)
styles = getSampleStyleSheet()

# Split HTML into paragraphs (simple way)
elements = []
for line in html.split('\n'):
    if line.strip():
        if line.startswith('<h1>'):
            elements.append(Paragraph(line.replace('<h1>', '').replace('</h1>', ''), styles['Heading1']))
        elif line.startswith('<h2>'):
            elements.append(Paragraph(line.replace('<h2>', '').replace('</h2>', ''), styles['Heading2']))
        elif line.startswith('<p>'):
            elements.append(Paragraph(line.replace('<p>', '').replace('</p>', ''), styles['Normal']))
        else:
            elements.append(Paragraph(line, styles['Normal']))
    elements.append(Spacer(1, 12))

doc.build(elements)
print("PDF generated: frontend-spec.pdf")