import sys
from docx import Document
import os

def generate_coversheet(stock_number, manufacturer, model, year, web_width, colors, die_stations, description, dropbox_url, owner_company, owner_name, owner_phone, price, buy_price):
    doc = Document()
    doc.add_heading('Coversheet', 0)

    doc.add_paragraph(f'Stock Number: {stock_number}')
    doc.add_paragraph(f'Category: Press')
    doc.add_paragraph(f'Manufacturer: {manufacturer}')
    doc.add_paragraph(f'Model: {model}')
    doc.add_paragraph(f'Year: {year}')
    doc.add_paragraph(f'Web Width: {web_width}')
    doc.add_paragraph(f'Colors: {colors}')
    doc.add_paragraph(f'Die Stations: {die_stations}')
    doc.add_paragraph(f'Description: {description}')
    doc.add_paragraph(f'Dropbox URL: {dropbox_url}')
    doc.add_paragraph(f'Owner Company: {owner_company}')
    doc.add_paragraph(f'Owner Name: {owner_name}')
    doc.add_paragraph(f'Owner Phone: {owner_phone}')
    doc.add_paragraph(f'Price: {price}')
    doc.add_paragraph(f'Buy Price: {buy_price}')
    
    filename = f'{stock_number} Coversheet.docx'
    save_path = os.path.join(os.getcwd(), filename)
    doc.save(save_path)

if __name__ == "__main__":
    generate_coversheet(*sys.argv[1:])

