import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import * as path from 'path';
import { updateStatus } from '../mednuc-status/update-status';

// Charger les variables d'environnement depuis la racine du projet
dotenv.config({ path: path.join(__dirname, '..', '.env') });

test('Vérification du statut de l\'article', async ({ page }) => {
  // Accéder à la page de connexion
  await page.goto('https://www.editorialmanager.com/mednuc/default.aspx');
  
  // Attendre que la page soit chargée
  await page.waitForLoadState('networkidle');
  
  await page.locator('iframe[name="content"]').contentFrame().locator('iframe[name="login"]').contentFrame().locator('#username').fill(process.env.EM_USERNAME || '');
  await page.locator('iframe[name="content"]').contentFrame().locator('iframe[name="login"]').contentFrame().locator('#passwordTextbox').fill(process.env.EM_PASSWORD || '');
  await page.locator('iframe[name="content"]').contentFrame().locator('iframe[name="login"]').contentFrame().locator('#passwordTextbox').press('Enter');
  
  // Attendre que la page soit chargée après la connexion
  await page.waitForLoadState('networkidle');
  
  await page.locator('iframe[name="content"]').contentFrame().getByRole('link', { name: 'Articles en cours de' }).click();
   
  // Attendre que l'iframe principal soit disponible
  const contentFrame = await page.frameLocator('iframe[name="content"]');
  
  // Attendre que le tableau soit visible et récupérer les informations
  await contentFrame.locator('#row1').waitFor();
  const manuscriptNumber = await contentFrame.locator('#row1').locator('td').nth(1).textContent();
  const title = await contentFrame.locator('#row1').locator('td').nth(2).textContent();
  const status = await contentFrame.locator('#row1').locator('td').nth(5).textContent();

  // Mettre à jour le fichier de statut
  updateStatus(
    manuscriptNumber?.trim() || '',
    title?.trim() || '',
    status?.trim() || 'Non disponible'
  );
  
  console.log('État d\'avancement de l\'article:', status?.trim());
  console.log('Statut mis à jour dans status.json');

  // Vérifier que le statut est présent
  expect(status).toBeTruthy();
}); 