// admin/src/leakedSources/LeakedSourceList.tsx
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
  TextInput,
  ReferenceInput,
  AutocompleteInput,
  TopToolbar,
  CreateButton,
  FilterButton,
  useListContext,
} from 'react-admin'

const filters = [
  <ReferenceInput key="modId" source="modId" reference="mods" label="Мод">
    <AutocompleteInput optionText="title" />
  </ReferenceInput>,
  <TextInput key="platform" source="platform" label="Платформа" />,
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

export const LeakedSourceList = () => (
  <List filters={filters} actions={<ListActions />} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ReferenceField source="modId" reference="mods" label="Мод">
        <TextField source="title" />
      </ReferenceField>
      <TextField source="platform" />
      <TextField source="originalUrl" />
      <TextField source="downloadUrl" />
      <DateField source="leakedAt" showTime />
    </Datagrid>
  </List>
)
