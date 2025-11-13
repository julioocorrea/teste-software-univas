// frontend/tests/integration/Users.load.int.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import Category from '../../src/components/Categories'
import { server, apiGet, json } from '../setup'

describe('Category integration - carga de lista', () => {
  it('renderiza category retornados pela API', async () => {
    server.use(
      apiGet('/categories', (_req) =>
        json({
          data: [
            { id: '1', name: 'CategoriaA', description: 'Descrição teste', createdAt: new Date().toISOString(), tasks: [] },
          ]
        })
      )
    )

    render(<Category />)

    await waitFor(() => {
      expect(screen.getByText('CategoriaA')).toBeInTheDocument()
      expect(screen.getByText('Descrição teste')).toBeInTheDocument()
    })
  })
})