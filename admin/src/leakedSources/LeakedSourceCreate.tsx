// admin/src/leakedSources/LeakedSourceCreate.tsx
import {
  Create,
  SimpleForm,
  TextInput,
  ReferenceInput,
  AutocompleteInput,
  required,
} from 'react-admin'

export const LeakedSourceCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="modId" reference="mods" label="Мод">
        <AutocompleteInput optionText="title" validate={required()} />
      </ReferenceInput>
      <TextInput source="platform" label="Платформа" validate={required()} />
      <TextInput source="originalUrl" label="Оригинальный URL" validate={required()} fullWidth />
      <TextInput source="downloadUrl" label="Ссылка для скачивания" validate={required()} fullWidth />
      <TextInput source="note" label="Заметка" multiline fullWidth />
    </SimpleForm>
  </Create>
)
