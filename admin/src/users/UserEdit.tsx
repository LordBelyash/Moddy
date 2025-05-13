import {
    Edit,
    SimpleForm,
    TextInput,
    DateField,
    useRecordContext,
  } from 'react-admin'
  
  const UserTitle = () => {
    const record = useRecordContext()
    return <span>Редактировать пользователя: {record?.username}</span>
  }
  
  export const UserEdit = () => (
    <Edit title={<UserTitle />}>
      <SimpleForm>
        <TextInput source="id" disabled fullWidth />
        <TextInput source="username" fullWidth />
        <TextInput source="email" fullWidth />
        <TextInput source="avatarUrl" fullWidth />
        <TextInput source="bio" multiline rows={3} fullWidth />
        <DateField source="createdAt" label="Создан" />
        <DateField source="updatedAt" label="Обновлён" />
      </SimpleForm>
    </Edit>
  )
  