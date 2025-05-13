// admin/src/modVersions/ModVersionList.tsx
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
  NumberField,
  TextInput,
  ReferenceInput,
  AutocompleteInput,
  TopToolbar,
  CreateButton,
  FilterButton,
  useListContext,
} from 'react-admin'

const filters = [
  <TextInput key="version" source="version" label="Версия" alwaysOn />,
  <ReferenceInput key="modId" source="modId" reference="mods" label="Мод">
    <AutocompleteInput optionText="title" />
  </ReferenceInput>,
]

const ListActions = () => {
  const { displayedFilters, filterValues, showFilter } = useListContext()
  return (
    <TopToolbar>
      <FilterButton filters={filters} displayedFilters={displayedFilters} filterValues={filterValues} showFilter={showFilter} />
      <CreateButton />
    </TopToolbar>
  )
}

export const ModVersionList = () => (
  <List filters={filters} actions={<ListActions />} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <ReferenceField source="modId" reference="mods" label="Мод">
        <TextField source="title" />
      </ReferenceField>
      <TextField source="version" />
      <NumberField source="fileSize" />
      <DateField source="createdAt" showTime />
    </Datagrid>
  </List>
)
