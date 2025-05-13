import { Button } from '@mui/material'
import { useNotify } from 'react-admin'
import { useFormContext } from 'react-hook-form'

export const NexusImportButton = () => {
  const notify = useNotify()
  const { setValue, getValues } = useFormContext()

  const handleClick = async () => {
    const { nexusGame, nexusModId } = getValues()

    if (!nexusGame || !nexusModId) {
      notify('Укажи gameDomain и modId', { type: 'warning' })
      return
    }

    try {
      const response = await fetch(`http://localhost:3000/api/nexus/fetch-mod?game=${nexusGame}&modId=${nexusModId}`)
      const data = await response.json()

      setValue('title', data.title)
      setValue('description', data.description)
      setValue('imageUrl', data.picture)
      setValue('version', data.version)
      setValue('fileUrl', data.url ?? '')
      setValue('fileSize', data.fileSize ?? 0)

      notify('Данные загружены с NexusMods', { type: 'info' })
    } catch (err) {
      notify('Ошибка загрузки данных', { type: 'error' })
    }
  }

  return (
    <Button onClick={handleClick} variant="contained">
      Загрузить с Nexus
    </Button>
  )
}
