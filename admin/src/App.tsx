// src/App.tsx
import { Admin, Resource } from 'react-admin'
import simpleRestProvider from 'ra-data-simple-rest'
import { myTheme } from './theme'

import { UserList } from './users/UserList'
import { ModList } from './mods/ModList'
import { ModCreate } from './mods/ModCreate'

import { ModVersionList } from './modVersions/ModVersionList'
import { ModVersionCreate } from './modVersions/ModVersionCreate'
import { ModVersionEdit } from './modVersions/ModVersionEdit'

import { LeakedSourceList } from './leakedSources/LeakedSourceList'
import { LeakedSourceCreate } from './leakedSources/LeakedSourceCreate'
import { LeakedSourceEdit } from './leakedSources/LeakedSourceEdit'

const dataProvider = simpleRestProvider(import.meta.env.VITE_API_URL || 'http://localhost:3000/api')

export default function App() {
  return (
    <Admin theme={myTheme} dataProvider={dataProvider}>
      <Resource name="users" list={UserList} />
      <Resource name="mods" list={ModList} create={ModCreate} />
      <Resource name="mod-versions" list={ModVersionList} create={ModVersionCreate} edit={ModVersionEdit} />
      <Resource name="leaked-sources" list={LeakedSourceList} create={LeakedSourceCreate} edit={LeakedSourceEdit} />
    </Admin>
  )
}
