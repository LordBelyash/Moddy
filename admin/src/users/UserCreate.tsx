import { Create, SimpleForm, TextInput } from 'react-admin'

export const UserCreate = () => (
  <Create title="Создать пользователя">
    <SimpleForm>
      <TextInput source="username" fullWidth />
      <TextInput source="email" fullWidth />
      <TextInput source="avatarUrl" fullWidth />
      <TextInput source="bio" multiline rows={3} fullWidth />
    </SimpleForm>
  </Create>
)
