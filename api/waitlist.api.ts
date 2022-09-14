import { google } from 'googleapis'

type SheetForm = {
  email: string
  bitkub_account: boolean
  phone: string
  waitlist: boolean
  subscribe: boolean
}

export const submitForm = async (data) => {
  const body = data as SheetForm

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL,
        private_key: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY?.replace(
          /\\n/g,
          '\n'
        ),
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
      spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID,
      range: 'A1:E1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            body.email,
            body.bitkub_account,
            body.phone,
            body.waitlist,
            body.subscribe,
          ],
        ],
      },
    })
    return response
  } catch (e) {
    console.error(e)
  }
}
