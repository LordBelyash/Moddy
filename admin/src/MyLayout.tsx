// src/MyLayout.tsx
import * as React from 'react'
import { Layout, LayoutProps } from 'react-admin'
import { MyAppBar } from './MyAppBar'

export const MyLayout: React.FC<LayoutProps> = (props) => (
  <Layout {...props} appBar={MyAppBar} />
)
