import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import fs from 'fs'

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath)
    const data = await pdfParse(dataBuffer)
    return data.text
  } catch (error) {
    console.error('Error parsing PDF:', error)
    throw new Error('Failed to parse PDF')
  }
}

export const extractTextFromDOCX = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath })
    return result.value
  } catch (error) {
    console.error('Error parsing DOCX:', error)
    throw new Error('Failed to parse DOCX')
  }
}

export const extractTextFromDOC = async (filePath) => {
  // For .doc files, we'll use a simple approach
  // In production, consider using a more robust solution
  try {
    const result = await mammoth.extractRawText({ path: filePath })
    return result.value
  } catch (error) {
    console.error('Error parsing DOC:', error)
    throw new Error('Failed to parse DOC')
  }
}

export const normalizeText = (text) => {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim()
}
