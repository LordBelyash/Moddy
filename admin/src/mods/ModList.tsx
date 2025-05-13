// admin/src/mods/ModList.tsx
import {
    List,
    Datagrid,
    TextField,
    DateField,
    TextInput,
    ReferenceInput,
    AutocompleteInput,
    FilterButton,
    CreateButton,
    TopToolbar,
    useListContext,
    ListProps,
    Pagination,
    NumberField,
  } from 'react-admin'
  import { FaEye, FaDownload, FaComment } from 'react-icons/fa'
  import { useEffect } from 'react'
  
  // 🔹 Фильтры
  const modFilters = [
    <TextInput key="title" source="title" label="Название" alwaysOn />,
    <ReferenceInput key="gameId" source="gameId" reference="games" label="Игра">
      <AutocompleteInput optionText="name" />
    </ReferenceInput>,
    <ReferenceInput key="categoryId" source="categoryId" reference="categories" label="Категория">
      <AutocompleteInput optionText="name" />
    </ReferenceInput>,
  ]
  
  // 🔹 Панель действий
  const ModListActions = () => {
    const { displayedFilters, filterValues, showFilter } = useListContext()
    return (
      <TopToolbar className="flex justify-between items-center bg-base-100 p-2 border-b border-base-content/10">
        <div className="flex gap-2">
          <FilterButton filters={modFilters} displayedFilters={displayedFilters} filterValues={filterValues} showFilter={showFilter} />
          <CreateButton />
        </div>
      </TopToolbar>
    )
  }
  
  // 🔹 Компонент списка
  export const ModList: React.FC<ListProps> = (props) => {
    useEffect(() => {
      document.body.classList.add('bg-base-200', 'text-base-content')
    }, [])
  
    return (
      <List
        {...props}
        filters={modFilters}
        actions={<ModListActions />}
        perPage={25}
      >
        <Datagrid
          rowClick="edit"
          className="bg-base-100 text-base-content rounded shadow-sm overflow-hidden"
        >
          <TextField source="id" label="ID" />
          <TextField source="title" label="Название" />
          <TextField source="slug" label="Слаг" />
          <TextField source="game.name" label="Игра" />
          <TextField source="category.name" label="Категория" />
          <NumberField source="_count.comments" label={<FaComment title="Комментарии" />} />
          <NumberField source="_count.downloads" label={<FaDownload title="Загрузки" />} />
          <NumberField source="_count.views" label={<FaEye title="Просмотры" />} />
          <DateField source="createdAt" label="Создан" showTime />
        </Datagrid>
        <Pagination />
      </List>
    )
  }
  