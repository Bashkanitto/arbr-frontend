import AuthPage from '@pages/AuthPage/AuthPage'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('LoginForm', () => {
  it('renders input and button', () => {
    render(<AuthPage />)
    expect(screen.getByPlaceholderText('Ваша Почта')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ваш Пароль')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })
})
