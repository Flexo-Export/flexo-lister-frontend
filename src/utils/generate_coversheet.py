import sys
from docx import Document
import os

def generate_coversheet(stock_number, manufacturer, model, year, web_width, colors, die_stations, description, dropbox_url, owner_company, owner_name, owner_phone, price, buy_price, notes):
    doc = Document()
    doc.add_heading('Coversheet', 0)

    doc.add_paragraph(f'Stock Number: {stock_number}')
    doc.add_paragraph(f'Category: Press')
    
    if manufacturer:
        doc.add_paragraph(f'Manufacturer: {manufacturer}')
    if model:
        doc.add_paragraph(f'Model: {model}')
    if year:
        doc.add_paragraph(f'Year: {year}')
    if web_width:
        doc.add_paragraph(f'Web Width: {web_width}')
    if colors:
        doc.add_paragraph(f'Colors: {colors}')
    if die_stations:
        doc.add_paragraph(f'Die Stations: {die_stations}')
    if description:
        doc.add_paragraph(f'Description: {description}')
    if dropbox_url:
        doc.add_paragraph(f'Dropbox URL: {dropbox_url}')
    if owner_company:
        doc.add_paragraph(f'Owner Company: {owner_company}')
    if owner_name:
        doc.add_paragraph(f'Owner Name: {owner_name}')
    if owner_phone:
        doc.add_paragraph(f'Owner Phone: {owner_phone}')
    if price:
        doc.add_paragraph(f'Price: {price}')
    if buy_price:
        doc.add_paragraph(f'Buy Price: {buy_price}')
    if notes:
        doc.add_paragraph(f'Additional Notes: {notes}')
    
    filename = f'{stock_number} Coversheet.docx'
    save_path = os.path.join(os.getcwd(), filename)
    doc.save(save_path)

if __name__ == "__main__":
    generate_coversheet(*sys.argv[1:])

