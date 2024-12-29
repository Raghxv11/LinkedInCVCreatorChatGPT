import * as PDFJS from 'pdfjs-dist';
import mammoth from 'mammoth';

export async function parseDocument(file) {
  const fileType = file.type;

  // Handle different file types
  switch (fileType) {
    case 'text/plain':
      return await file.text();
      
    case 'application/pdf':
      return await parsePDF(file);
      
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return await parseDocx(file);
      
    default:
      throw new Error('Unsupported file type');
  }
}

async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFJS.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
  }
  
  return text;
}

async function parseDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
} 