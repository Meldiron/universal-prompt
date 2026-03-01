import { Client, Databases, ID, Query } from 'appwrite'

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '')

const databases = new Databases(client)

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || ''
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID || ''

function generateShortId(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length]
  }
  return result
}

export async function createShortLink(prompt: string): Promise<string> {
  const shortId = generateShortId()

  await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
    shortId,
    prompt,
    createdAt: new Date().toISOString(),
  })

  return shortId
}

export async function getPromptByShortId(shortId: string): Promise<string | null> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('shortId', shortId),
      Query.limit(1),
    ])

    if (response.documents.length > 0) {
      return response.documents[0].prompt as string
    }
    return null
  } catch {
    return null
  }
}

export function isAppwriteConfigured(): boolean {
  return !!(
    import.meta.env.VITE_APPWRITE_PROJECT_ID &&
    import.meta.env.VITE_APPWRITE_DATABASE_ID &&
    import.meta.env.VITE_APPWRITE_COLLECTION_ID
  )
}
