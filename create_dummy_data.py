import openpyxl
from openpyxl import Workbook
import os

def create_dummy_excel():
    wb = Workbook()
    ws = wb.active
    ws.title = "Students"

    # Headers
    headers = ["Serial Number", "Student Name", "Grade", "School Name", "Phone Number"]
    ws.append(headers)

    # Dummy Data
    data = [
        ["STU001", "Alice Johnson", "5", "Springfield Elementary", "555-0101"],
        ["STU002", "Bob Smith", "6", "Lincoln Middle School", "555-0102"],
        ["STU003", "Charlie Brown", "5", "Springfield Elementary", "555-0103"],
        ["STU004", "Diana Prince", "7", "Gotham Academy", "555-0104"],
        ["STU005", "Evan Wright", "6", "Lincoln Middle School", "555-0105"],
        ["STU006", "Fiona Gallagher", "8", "North Side High", "555-0106"],
        ["STU007", "George Martin", "5", "Westeros Primary", "555-0107"],
        ["STU008", "Hannah Abbott", "7", "Hogwarts", "555-0108"],
        ["STU009", "Ian Malcolm", "8", "Jurassic High", "555-0109"],
        ["STU010", "Jane Doe", "6", "Sunnydale School", "555-0110"]
    ]

    for row in data:
        ws.append(row)

    # Save
    filename = "dummy_students.xlsx"
    filepath = os.path.join(os.getcwd(), filename)
    wb.save(filepath)
    print(f"Created {filepath}")

if __name__ == "__main__":
    create_dummy_excel()
