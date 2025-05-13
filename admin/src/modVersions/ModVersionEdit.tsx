import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
  AutocompleteInput,
  NumberInput,
  required,
} from 'react-admin'

export const ModVersionEdit = () => (
  <Edit title="Редактировать версию мода">
    <SimpleForm>
      <TextInput source="id" disabled fullWidth />
      <ReferenceInput source="modId" reference="mods" label="Мод">
        <AutocompleteInput optionText="title" validate={required()} />
      </ReferenceInput>
      <TextInput source="version" label="Версия" validate={required()} fullWidth />
      <TextInput source="fileUrl" label="Ссылка на файл" validate={required()} fullWidth />
      <NumberInput source="fileSize" label="Размер файла (байт)" fullWidth />
      <TextInput source="changelog" label="Изменения" multiline fullWidth />
    </SimpleForm>
  </Edit>
)
