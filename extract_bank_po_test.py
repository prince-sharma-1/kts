import json
from docx import Document

SOURCE = r"C:\Users\dell\Desktop\Bank PO score high.docx"
DESTINATION = "files/bank-po-score-high.json"

def value(row, index=1):
    cells = [cell.text.strip() for cell in row.cells]
    return cells[index] if len(cells) > index else cells[-1]

document = Document(SOURCE)
questions = []

for number, table in enumerate(document.tables, start=1):
    rows = table.rows
    question = value(rows[0]).replace("\n", "\n").strip()
    options, answer, solution, marks = [], None, "", 1
    for row in rows[1:]:
        label = value(row, 0).lower()
        text = value(row)
        cells = [cell.text.strip().lower() for cell in row.cells]
        if label == "option":
            options.append(text)
            if "correct" in cells[2:]:
                answer = len(options) - 1
        elif label == "solution":
            solution = text
        elif label == "marks":
            try:
                marks = int(text)
            except ValueError:
                pass
    if question and options and answer is not None:
        questions.append({
            "id": number,
            "question": question,
            "options": options,
            "answerIndex": answer,
            "solution": solution,
            "marks": marks
        })

with open(DESTINATION, "w", encoding="utf-8") as output:
    json.dump({
        "id": "bank-po-english-practice-01",
        "title": "Bank PO English Practice Test",
        "exam": "Bank PO",
        "type": "English Language",
        "durationMinutes": 60,
        "questionCount": len(questions),
        "totalMarks": sum(question["marks"] for question in questions),
        "questions": questions
    }, output, ensure_ascii=False, indent=2)

print(f"Created {DESTINATION} with {len(questions)} questions.")
