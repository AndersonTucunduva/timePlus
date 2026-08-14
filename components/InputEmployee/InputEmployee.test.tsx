import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import InputEmployee from './InputEmployee'
import { newEmployee } from '@/app/api/actions'

vi.mock('@/app/api/actions', () => ({
  newEmployee: vi.fn(),
}))

describe('InputEmployee', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('prevents a second submission while the employee is being created', async () => {
    let finishCreation: () => void = () => undefined
    vi.mocked(newEmployee).mockImplementation(
      () =>
        new Promise((resolve) => {
          finishCreation = () => resolve({
            id: 1,
            name: 'Ana',
            role: 'Vendedora',
            status: true,
            createdAt: new Date(),
            deletedAt: null,
          })
        }),
    )

    render(<InputEmployee />)

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar funcionário' }))
    fireEvent.change(screen.getByPlaceholderText('Novo funcionário'), {
      target: { value: 'Ana' },
    })

    const submitButton = screen.getByRole('button', {
      name: 'Criar funcionário',
    })
    fireEvent.click(submitButton)

    expect(newEmployee).toHaveBeenCalledTimes(1)
    expect((submitButton as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByText('Salvando...')).toBeTruthy()

    finishCreation()
  })
})
