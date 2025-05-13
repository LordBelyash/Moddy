// admin/src/modVersions/ModVersionCreate.tsx
import {
  Create,
  SimpleForm,
  TextInput,
  ReferenceInput,
  AutocompleteInput,
  NumberInput,
  required,
} from 'react-admin'

export const ModVersionCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="modId" reference="mods" label="Мод">
        <AutocompleteInput optionText="title" validate={required()} />
      </ReferenceInput>
      <TextInput source="version" label="Версия" validate={required()} />
      <TextInput source="fileUrl" label="Файл (URL)" validate={required()} fullWidth />
      <NumberInput source="fileSize" label="Размер файла (в байтах)" />
      <TextInput source="changelog" label="Changelog" multiline fullWidth />
    </SimpleForm>
  </Create>
)
