import { test, expect } from '@playwright/test'
test.describe('Categorias', () => {

  test('cria categoria e aparece na lista', async ({ page }) => {
    await page.goto('/categories')
    await page.getByRole('button', { name: /Adicionar Categoria/i }).click()  
    const uniqueName = `categoria ${Date.now()}`
    const uniqueDescription = `descrição ${Date.now()}`
    await page.getByLabel('Nome:').fill(uniqueName)
    await page.getByLabel('Descrição:').fill(uniqueDescription)  
    await page.getByRole('button', { name: /Criar/i }).click()
    await expect(page.getByText(uniqueName)).toBeVisible()
  });

  test('navega para Categorias e lista itens do backend', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Categorias' }).click()
    await expect(page.getByRole('heading', { name: /Categorias/i })).toBeVisible()
    await expect(page.getByText(/Personal tasks and activities/i)).toBeVisible()
    await expect(page.getByText(/Tasks related to work and professional activities/i)).toBeVisible()
  });

  test('atualiza uma categoria existente', async ({ page }) => {
    await page.goto('/categories')
    const row = page.getByRole('row', { name: /Study/i })
    await row.getByRole('button', { name: /Editar/i }).click()
    const novoNome = 'categoria atualizada'
    const novaDescricao = `descrição atualizada`
    await page.getByLabel('Nome:').fill(novoNome)
    await page.getByLabel('Descrição:').fill(novaDescricao)
    await page.getByRole('button', { name: /Atualizar/i }).click()
    await expect(page.getByText(novoNome)).toBeVisible()
    await expect(page.getByText(novoNome)).toBeVisible()
  })

  test('exclui uma categoria existente', async ({ page }) => {
    await page.goto('/categories')
    const nomeTemp = `Categoria ${Date.now()}`
    const descricaoTemp = `descrição atualizada`
    await page.getByRole('button', { name: /Adicionar Categoria/i }).click()
    await page.getByLabel('Nome:').fill(nomeTemp)
    await page.getByLabel('Descrição:').fill(descricaoTemp)
    await page.getByRole('button', { name: /Criar/i }).click()
    await expect(page.getByText(nomeTemp)).toBeVisible()
    const row = page.getByRole('row', { name: nomeTemp })
    
    page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Tem certeza que deseja excluir esta categoria?')
        await dialog.accept()  
    })

    await row.getByRole('button', { name: /Excluir/i }).click()
    await expect(page.getByText(nomeTemp)).not.toBeVisible()
  })


});
