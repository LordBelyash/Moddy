// C:\projects\admin\src\users\UserList.tsx
import * as React from 'react'
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  TextInput,
  SelectInput,
  FilterButton,
  CreateButton,
  Pagination,
  TopToolbar,
  ListProps,
} from 'react-admin'

// 1) Определяем фильтры как массив JSX-элементов
const userFilters = [
  <TextInput
    key="username"
    source="username"
    label="Имя пользователя"
    alwaysOn
  />,
  <TextInput key="email" source="email" label="Email" />,
  <SelectInput
    key="role"
    source="role"
    label="Роль"
    choices={[
      { id: 'USER', name: 'Пользователь' },
      { id: 'ADMIN', name: 'Админ' },
    ]}
  />,
  <SelectInput
    key="banned"
    source="banned"
    label="Забанен"
    choices={[
      { id: false, name: 'Нет' },
      { id: true, name: 'Да' },
    ]}
  />,
]

// 2) Кастомный тулбар с FilterButton и CreateButton
const UserListActions: React.FC = () => (
  <TopToolbar>
    {/* Передаём сюда тот же массив фильтров */}
    <FilterButton filters={userFilters} />
    <CreateButton />
  </TopToolbar>
)

// 3) Основной компонент UserList
export const UserList: React.FC<ListProps> = props => (
  <List
    {...props}
    filters={userFilters}       // ← массив фильтров передаётся сюда
    actions={<UserListActions />}  
    perPage={25}
    pagination={<Pagination />}
  >
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="username" label="Имя пользователя" />
      <EmailField source="email" label="Email" />
      <TextField source="role" label="Роль" />
      <TextField source="banned" label="Забанен" />
      <DateField source="createdAt" label="Создан" showTime />
    </Datagrid>
  </List>
)
