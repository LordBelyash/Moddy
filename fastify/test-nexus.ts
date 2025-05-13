// test-nexus.ts
import { fetchModInfo } from './nexusParser'

const game = 'thesims4'
const modId = 3924 // замените на актуальный ID

fetchModInfo(game, modId)
  .then((mod) => {
    console.log('✅ Данные о моде получены:\n', mod)
  })
  .catch((err) => {
    console.error('❌ Ошибка:', err.message)
  })
