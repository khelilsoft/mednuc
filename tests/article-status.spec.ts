import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Charger les variables d'environnement
dotenv.config();

test('Vérification du statut de l\'article', async ({ page }) => {
  // Accéder à la page de connexion
  await page.goto('https://www.editorialmanager.com/mednuc/default.aspx');
  
  // Attendre que la page soit chargée
  await page.waitForLoadState('networkidle');
  
  await page.locator('iframe[name="content"]').contentFrame().locator('iframe[name="login"]').contentFrame().locator('#username').fill('sefraoui.khelil');
  await page.locator('iframe[name="content"]').contentFrame().locator('iframe[name="login"]').contentFrame().locator('#passwordTextbox').fill('eLexir@1810');
  await page.locator('iframe[name="content"]').contentFrame().locator('iframe[name="login"]').contentFrame().locator('#passwordTextbox').press('Enter');
  
  // Attendre que la page soit chargée après la connexion
  await page.waitForLoadState('networkidle');
  
  await page.locator('iframe[name="content"]').contentFrame().getByRole('link', { name: 'Articles en cours de' }).click();
   
  // Attendre que l'iframe principal soit disponible
  const contentFrame = await page.frameLocator('iframe[name="content"]');
  
  // Attendre que le tableau soit visible et récupérer l'état d'avancement (6ème cellule)
  await contentFrame.locator('#row1').waitFor();
  const status = await contentFrame.locator('#row1').locator('td').nth(5).textContent();
  const trimmedStatus = status?.trim() || 'Non disponible';
  
  // Lire le template du fichier status.md
  const statusFilePath = path.join(process.cwd(), 'status.md');
  let content = fs.readFileSync(statusFilePath, 'utf8');
  
  // Mettre à jour le contenu avec le nouveau statut et la date
  const currentDate = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
  content = content.replace('<!-- DATE -->', currentDate);
  content = content.replace('<!-- STATUS -->', trimmedStatus);
  
  // Écrire le nouveau contenu dans le fichier
  fs.writeFileSync(statusFilePath, content);
  
  console.log('État d\'avancement de l\'article:', trimmedStatus);
  console.log('Statut mis à jour dans status.md');

  // Vérifier que le statut est présent
  expect(status).toBeTruthy();
}); 