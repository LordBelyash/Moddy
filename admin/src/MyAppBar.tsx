// src/MyAppBar.tsx
import * as React from 'react'
import { AppBar, TitlePortal } from 'react-admin'
import { ThemeSwitcher } from './ThemeSwitcher'

export const MyAppBar: React.FC = (props) => (
  <AppBar {...props}>
    <TitlePortal>
      <span className="btn btn-ghost normal-case text-xl">
        Моя админка
      </span>
    </TitlePortal>
    <div className="flex-1" />
    <ThemeSwitcher />
  </AppBar>
)
