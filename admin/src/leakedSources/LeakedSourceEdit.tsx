import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
  AutocompleteInput,
  required,
  UrlField,
} from 'react-admin'

export const LeakedSourceEdit = () => (
  <Edit title="Редактировать утечку">
    <SimpleForm>
      <TextInput source="id" disabled fullWidth />
<ReferenceInput source="modId" reference="mods" label="Мод">
  <AutocompleteInput optionText="title" validate={required()} />
</ReferenceInput>
      <TextInput source="platform" label="Платформа" validate={required()} fullWidth />
      <TextInput source="originalUrl" label="Оригинальный URL" validate={required()} fullWidth />
      <TextInput source="downloadUrl" label="Ссылка на скачивание" validate={required()} fullWidth />
      <TextInput source="note" label="Примечание" multiline fullWidth />
    </SimpleForm>
  </Edit>
)
