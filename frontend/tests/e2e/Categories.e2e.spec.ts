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

});
