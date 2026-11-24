"""Genera el PDF del reporte con la identidad visual de La Salle México.

Uso: python generar_reporte.py  (requiere reportlab y Pillow)
"""
from html import escape
from pathlib import Path
import re

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (Image, PageBreak, Paragraph, Preformatted, SimpleDocTemplate, Spacer, Table,
                                TableStyle)

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'Reporte_HablaChido.md'
OUTPUT = ROOT / 'Reporte_HablaChido_GIGN.pdf'
FECHA = '23 de noviembre de 2026'
REPO = 'https://github.com/aristocratte/ProyectoFinal'
WIDTH = A4[0] - 90
BLUE = colors.HexColor('#001D68')
RED = colors.HexColor('#D21034')
GRAY = colors.HexColor('#445066')

for name in ['Indivisa', 'IndivisaBold', 'IndivisaTitle']:
    pdfmetrics.registerFont(TTFont(name, str(ROOT / 'identidad/fuentes' / (name + '.ttf'))))
italic_path = Path('/System/Library/Fonts/Supplemental/Arial Italic.ttf')
italic_font = 'Helvetica-Oblique'
if italic_path.exists():
    pdfmetrics.registerFont(TTFont('ArialItalic', str(italic_path)))
    italic_font = 'ArialItalic'
pdfmetrics.registerFontFamily('Indivisa', normal='Indivisa', bold='IndivisaBold', italic=italic_font,
                              boldItalic='Helvetica-BoldOblique')

body = ParagraphStyle('Body', fontName='Indivisa', fontSize=10.8, leading=15, textColor=GRAY, spaceAfter=7)
heading = ParagraphStyle('Heading', fontName='IndivisaTitle', fontSize=23, leading=27, textColor=BLUE, spaceAfter=15,
                         keepWithNext=True)
subheading = ParagraphStyle('Subheading', fontName='IndivisaBold', fontSize=12.5, leading=16, textColor=BLUE,
                            spaceBefore=5, spaceAfter=5, keepWithNext=True)
small = ParagraphStyle('Small', parent=body, fontSize=9.6, leading=12.6, spaceAfter=5)
cell_header = ParagraphStyle('CellHeader', parent=small, fontName='IndivisaBold', textColor=BLUE)
caption = ParagraphStyle('Caption', parent=small, alignment=TA_CENTER)
code = ParagraphStyle('Code', fontName='Courier', fontSize=8.6, leading=11.2, textColor=BLUE, leftIndent=10,
                      backColor=colors.HexColor('#F3F5F9'), borderPadding=(6, 8, 6, 8), spaceBefore=4, spaceAfter=12)
reference = ParagraphStyle('Reference', parent=body, fontSize=9.9, leading=13, leftIndent=25, firstLineIndent=-25,
                           spaceAfter=7, splitLongWords=True)
cover_title = ParagraphStyle('Cover', fontName='IndivisaTitle', fontSize=58, leading=66, textColor=BLUE, spaceAfter=16)
cover_sub = ParagraphStyle('CoverSub', fontName='IndivisaBold', fontSize=21, leading=28, textColor=BLUE, spaceAfter=14)

# Anchos de columna según el número de columnas de cada tabla
COLUMNAS = {2: [0.45, 0.55], 3: [0.36, 0.2, 0.44], 4: [0.2, 0.25, 0.28, 0.27]}


def inline(text):
    fragments = []

    def hold(fragment):
        fragments.append(fragment)
        return f'PLACEHOLDER{len(fragments) - 1}END'

    text = re.sub(r'https?://[^\s]+', lambda m: hold(
        f'<link href="{escape(m.group(), quote=True)}" color="#001D68">{escape(m.group())}</link>'), text)
    text = escape(text)
    text = re.sub(r'`([^`]+)`', r'<font name="IndivisaBold">\1</font>', text)
    text = re.sub(r'\*([^*]+)\*', r'<i>\1</i>', text)
    for index, fragment in enumerate(fragments):
        text = text.replace(f'PLACEHOLDER{index}END', fragment)
    return text


def para(text, style=body):
    return Paragraph(inline(text), style)


def asset(relative, width):
    path = ROOT / relative
    with PILImage.open(path) as source:
        image_width, image_height = source.size
    result = Image(str(path), width=width, height=width * image_height / image_width)
    result.hAlign = 'CENTER'
    return result


def markdown_table(lines):
    rows = [[cell.strip() for cell in line.strip().strip('|').split('|')] for line in lines]
    rows = [row for row in rows if not all(re.fullmatch(r':?-+:?', cell) for cell in row)]
    count = len(rows[0])
    screenshot = rows[0][0].startswith('![')
    widths = [WIDTH / count] * count if screenshot else [WIDTH * share for share in COLUMNAS[count]]
    values = []
    for row_index, row in enumerate(rows):
        values_row = []
        for col_index, cell in enumerate(row):
            image = re.fullmatch(r'!\[([^\]]*)\]\(([^)]+)\)', cell)
            if image:
                values_row.append(asset(image.group(2), widths[col_index] - 22))
            elif screenshot:
                values_row.append(para(cell, caption))
            else:
                values_row.append(para(cell, cell_header if row_index == 0 else small))
        values.append(values_row)
    table = Table(values, colWidths=widths, hAlign='LEFT', repeatRows=0 if screenshot else 1)
    commands = [
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]
    if not screenshot:
        commands += [
            ('LINEBELOW', (0, 0), (-1, 0), 1, BLUE),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#E8EDF7')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F3F5F9')]),
        ]
    table.setStyle(TableStyle(commands))
    return table


def footer(canvas, doc):
    canvas.setStrokeColor(RED)
    canvas.setLineWidth(1.2)
    canvas.line(45, 41, A4[0] - 45, 41)
    canvas.setFont('Indivisa', 8)
    canvas.setFillColor(GRAY)
    canvas.drawString(45, 26, f'APLICACIONES MÓVILES · Reporte de proyecto · Equipo GIGN · {FECHA}')
    canvas.drawRightString(A4[0] - 45, 26, str(doc.page))


def draw_logo(canvas, x, y, width):
    logo = ROOT / 'identidad/lasalle-mexico.png'
    with PILImage.open(logo) as source:
        image_width, image_height = source.size
    canvas.drawImage(str(logo), x, y, width=width, height=width * image_height / image_width, mask='auto')


def first_page(canvas, doc):
    canvas.setFillColor(BLUE)
    canvas.rect(0, A4[1] - 20, A4[0], 20, fill=1, stroke=0)
    draw_logo(canvas, 45, 715, 250)
    footer(canvas, doc)


def other_page(canvas, doc):
    draw_logo(canvas, 45, 782, 105)
    canvas.setFont('IndivisaBold', 9)
    canvas.setFillColor(BLUE)
    canvas.drawRightString(A4[0] - 45, 798, 'HABLACHIDO · PROYECTO FINAL')
    footer(canvas, doc)


story = [
    Spacer(1, 120),
    Paragraph('HablaChido', cover_title),
    Paragraph('Diccionario chilango de bolsillo', cover_sub),
    Paragraph('REPORTE DE PROYECTO FINAL', subheading),
    Spacer(1, 22),
    para('Asignatura', subheading),
    para('APLICACIONES MÓVILES'),
    para('Equipo GIGN', subheading),
    Paragraph('Aristide CORDONNIER<br/>Mathis GIL<br/>Oscar BUAT', body),
    Spacer(1, 10),
    para('Universidad La Salle México'),
    para(FECHA),
    Spacer(1, 10),
    para('React Native · Expo SDK 58 · Expo Router', subheading),
    Spacer(1, 10),
    para('Repositorio GitHub', subheading),
    para(REPO),
]

pages = SOURCE.read_text(encoding='utf-8').split('\n---\n')[1:]
for page in pages:
    story.append(PageBreak())
    lines = page.strip().splitlines()
    index = 0
    references = False
    while index < len(lines):
        line = lines[index].strip()
        if not line:
            index += 1
            continue
        if line.startswith('```'):
            block = []
            index += 1
            while not lines[index].strip().startswith('```'):
                block.append(lines[index].rstrip())
                index += 1
            story.append(Preformatted('\n'.join(block), code))
            index += 1
            continue
        if line.startswith('## '):
            references = line.startswith('## 9. Referencias')
            story.append(Paragraph(escape(line[3:]), heading))
            index += 1
            continue
        if line.startswith('### '):
            story.append(Paragraph(escape(line[4:]), subheading))
            index += 1
            continue
        if line.startswith('|'):
            table_lines = []
            while index < len(lines) and lines[index].strip().startswith('|'):
                table_lines.append(lines[index])
                index += 1
            story += [markdown_table(table_lines), Spacer(1, 10)]
            continue
        paragraph = [line]
        index += 1
        while index < len(lines) and lines[index].strip() and not lines[index].strip().startswith(('```', '|', '#')):
            paragraph.append(lines[index].strip())
            index += 1
        text = ' '.join(paragraph)
        style = reference if references else body
        story.append(para(text, style))

SimpleDocTemplate(
    str(OUTPUT), pagesize=A4, rightMargin=45, leftMargin=45, topMargin=82, bottomMargin=55,
    title='HablaChido - Reporte de proyecto final - APLICACIONES MÓVILES',
    author='Equipo GIGN: Aristide CORDONNIER, Mathis GIL y Oscar BUAT',
).build(story, onFirstPage=first_page, onLaterPages=other_page)
print(OUTPUT)
