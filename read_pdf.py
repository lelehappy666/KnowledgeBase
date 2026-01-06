
from pypdf import PdfReader
import sys

def extract_text_from_pdf(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    pdf_path = r"e:\KnowledgeBase\展品展项知识库体系.pdf"
    content = extract_text_from_pdf(pdf_path)
    print(content)
