import {
  Create,
  SimpleForm,
  TextInput,
  ReferenceInput,
  AutocompleteInput,
  BooleanInput,
  NumberInput,
  required,
  useNotify,
  useRedirect,
  SelectArrayInput,
  useDataProvider,
} from 'react-admin'
import { useEffect, useState } from 'react'
import { NexusImportButton } from './NexusImportButton'

export const ModCreate = () => {
  const notify = useNotify()
  const redirect = useRedirect()
  const dataProvider = useDataProvider()
  const [tagChoices, setTagChoices] = useState([])

  useEffect(() => {
    document.body.classList.add('bg-base-200', 'text-base-content')

    dataProvider.getList('tags', {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'name', order: 'ASC' },
      filter: {},
    }).then(({ data }) => {
      setTagChoices(data.map(tag => ({ id: tag.id, name: tag.name })))
    })
  }, [])

  return (
    <Create
      mutationOptions={{
        onSuccess: () => {
          notify('Мод успешно создан', { type: 'success' })
          redirect('/mods')
        },
        onError: (error: any) => {
          notify(`Ошибка: ${error.message}`, { type: 'error' })
        },
      }}
    >
      <SimpleForm>
        {/* Автозаполнение из Nexus */}
        <TextInput source="nexusGame" label="Nexus gameDomain" fullWidth />
        <NumberInput source="nexusModId" label="Nexus modId" fullWidth />
        <NexusImportButton />

        {/* Основное */}
        <TextInput source="title" label="Название" validate={required()} fullWidth />
        <TextInput source="slug" label="Слаг (можно оставить пустым)" fullWidth />
        <TextInput source="description" label="Описание" multiline fullWidth validate={required()} />
        <TextInput source="imageUrl" label="Изображение (URL)" fullWidth />
        <ReferenceInput source="gameId" reference="games" label="Игра">
          <AutocompleteInput optionText="name" validate={required()} />
        </ReferenceInput>
        <ReferenceInput source="categoryId" reference="categories" label="Категория">
          <AutocompleteInput optionText="name" validate={required()} />
        </ReferenceInput>
        <ReferenceInput source="authorId" reference="users" label="Автор">
          <AutocompleteInput optionText="username" validate={required()} />
        </ReferenceInput>
        <SelectArrayInput
          source="tagIds"
          label="Теги"
          choices={tagChoices}
          optionText="name"
        />
        <BooleanInput source="approved" label="Одобрен?" />

        {/* Текущая версия */}
        <TextInput source="version" label="Версия (например 1.0.2)" validate={required()} fullWidth />
        <TextInput source="fileUrl" label="Файл (URL)" validate={required()} fullWidth />
        <NumberInput source="fileSize" label="Размер файла (в байтах)" />
        <TextInput source="changelog" label="Changelog (список изменений)" multiline fullWidth />

        {/* Утечка */}
        <TextInput source="leaked.platform" label="Платформа утечки" fullWidth />
        <TextInput source="leaked.originalUrl" label="Оригинальный URL" fullWidth />
        <TextInput source="leaked.downloadUrl" label="Ссылка на скачивание" fullWidth />
        <TextInput source="leaked.note" label="Заметка / комментарий" multiline fullWidth />
      </SimpleForm>
    </Create>
  )
}
