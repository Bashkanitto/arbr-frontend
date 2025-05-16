import { MantineProvider } from '@mantine/core'
import AuthPage from '@pages/AuthPage/AuthPage'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'

describe('LoginForm', () => {
  it('renders input and button', () => {
    render(
      <MemoryRouter>
        <MantineProvider>
          <AuthPage />
        </MantineProvider>
      </MemoryRouter>
    )
    expect(screen.getByPlaceholderText('Ваша Почта')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ваш Пароль')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument()
  })
})
