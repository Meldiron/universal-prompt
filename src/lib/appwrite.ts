import { Client, TablesDB, ID } from 'appwrite'

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('69a4478f0011f314fc7d')

const tables = new TablesDB(client)

const DATABASE_ID = 'main';
const TABLE_ID_SHORTLINKS = 'short-links'
const TABLE_ID_REQUESTS = 'platform-requests'

export async function createShortLink(prompt: string): Promise<string> {
  const shortId = ID.unique()

  await tables.createRow(DATABASE_ID, TABLE_ID_SHORTLINKS, shortId, {
    prompt,
  })

  return shortId
}

export async function createCustomShortLink(prompt: string, slug: string): Promise<void> {
  await tables.createRow(DATABASE_ID, TABLE_ID_SHORTLINKS, slug, {
    prompt,
  })
}

export async function submitPlatformRequest(name: string, url: string): Promise<void> {
  await tables.createRow(DATABASE_ID, TABLE_ID_REQUESTS, ID.unique(), {
    name,
    url,
  })
}

export async function getPromptByShortId(shortId: string): Promise<string | null> {
  try {
    const response = await tables.getRow(DATABASE_ID, TABLE_ID_SHORTLINKS, shortId);
    
    return response.prompt as string;
    return null
  } catch {
    return null
  }
}
