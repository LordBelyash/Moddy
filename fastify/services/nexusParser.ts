// nexusParser.ts
import fetch from 'node-fetch'

// Заменить на свой реальный API-ключ и User-Agent
const API_KEY = process.env.NEXUS_API_KEY || 'Df/X4Pb1ixcu5YHMp/Na9Uoe+HqK8C2bNfs0a40Zvs33Kw5KvQ==--DFAM0O0svLUNcsBt--PtKSnd50GA9Ce+SnUFcI9Q=='
const USER_AGENT = 'MyModManager/1.0'

// Основной запрос
export async function fetchModInfo(gameDomain: string, modId: number) {
  const url = `https://api.nexusmods.com/v1/games/${gameDomain}/mods/${modId}.json`

  const res = await fetch(url, {
    headers: {
      apikey: API_KEY,
      'User-Agent': USER_AGENT,
    },
  })

  if (!res.ok) {
    throw new Error(`Ошибка получения данных с NexusMods: ${res.statusText}`)
  }

  const data = await res.json()

  return {
    id: data.mod_id,
    title: data.name,
    description: data.summary,
    author: data.author,
    category: data.category_name,
    version: data.version,
    createdAt: data.created_timestamp ? new Date(data.created_timestamp * 1000) : null,
    updatedAt: data.updated_timestamp ? new Date(data.updated_timestamp * 1000) : null,
    picture: data.picture_url,
    downloads: data.downloads,
    endorsements: data.endorsement_count,
    game: gameDomain,
    url: data.url,
  }
}
