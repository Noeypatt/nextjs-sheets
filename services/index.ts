import { FormRegisterInput } from '../pages/api/submit'

export const SubmitSheets = async (formData: FormRegisterInput) => {
  const rawResponse = await fetch('/api/submit', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
  const content = await rawResponse.json()
  return content
}
