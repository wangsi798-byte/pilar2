// Thin fetch wrapper — tidak butuh axios, tetap ringan

const BASE = 'https://pilar-api-cye9.vercel.app/api'

function getToken() {
  try {
    const raw = localStorage.getItem('pilar-auth')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.state?.token ?? parsed?.token ?? null
  } catch { return null }
}

async function request(method, path, body) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = {
    method,
    headers,
  }
  if (body) options.body = JSON.stringify(body)

  const res = await fetch(`${BASE}${path}`, options)

  const text = await res.text()

  if (!text) {
    const err = new Error('Empty response from server')
    err.status = res.status
    throw err
  }

  let data
  try {
    data = JSON.parse(text)
  } catch (e) {
    const err = new Error('Invalid JSON response')
    err.status = res.status
    throw err
  }

  if (!res.ok) {
    const err = new Error(data.message ?? 'Terjadi kesalahan pada server.')
    err.status = res.status
    throw err
  }

  return data
}

export const api = {
  get:    (path)         => request('GET',    path),
  post:   (path, body)   => request('POST',   path, body),
  put:    (path, body)   => request('PUT',    path, body),
  delete: (path)         => request('DELETE', path),
}
