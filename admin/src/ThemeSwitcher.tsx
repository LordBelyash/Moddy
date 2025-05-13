// src/ThemeSwitcher.tsx
import * as React from 'react'

// Список тем, объявленных в tailwind.config.js → daisyui.themes
const themes = [
  'light','dark','cupcake','bumblebee','emerald','corporate',
  'synthwave','retro','cyberpunk','valentine','halloween',
  'garden','forest','aqua','lofi','pastel','fantasy','wireframe',
  'black','luxury','dracula','cmyk','autumn','business','acid',
  'lemonade','night','coffee','winter',
]

export const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = React.useState(
    () => localStorage.getItem('ra-daisyui-theme') || 'light'
  )

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ra-daisyui-theme', theme)
  }, [theme])

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-sm m-1">
        🌗
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 max-h-64 overflow-y-auto"
      >
        {themes.map((t) => (
          <li key={t}>
            <button
              className={`w-full text-left ${t === theme ? 'font-bold' : ''}`}
              onClick={() => setTheme(t)}
            >
              {t}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
