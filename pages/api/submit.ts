import type { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'

const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
const privateKey = process.env.GOOGLE_PRIVATE_KEY
const spreadsheetId = process.env.GOOGLE_SHEET_ID

enum RegisterErrorCode {
  SheetsAuth = 'SHEET-ERROR-AUTH',
  SpreadSheets = 'SHEET-ERROR-GOOGLE-SPREAD-SHEET-ID',
}

export type FormRegisterInput = {
  email: string
  verifiedAccount?: string
  phoneNumber: string
  allow?: boolean
  subscribe?: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .send({ error: { message: 'Only POST requests allowed' } })
  }

  if (!clientEmail || !privateKey) {
    return res
      .status(500)
      .send({ error: { message: RegisterErrorCode.SheetsAuth } })
  }

  if (!spreadsheetId) {
    return res
      .status(500)
      .send({ error: { message: RegisterErrorCode.SpreadSheets } })
  }

  const body = req.body as FormRegisterInput

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey?.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    })

    const sheets = google.sheets({
      auth,
      version: 'v4',
    })

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A1:E1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[body.email, body.phoneNumber]],
      },
    })

    return res.status(201).json({
      data: response.data,
    })
  } catch (e) {
    return res
      .status((e as any).code)
      .send({ error: { message: (e as Error).message } })
  }
}
