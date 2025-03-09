import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

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
  
  // Attendre que le tableau soit visible et récupérer l'état d'avancement (6ème cellule)
  await contentFrame.locator('#row1').waitFor();
  const status = await contentFrame.locator('#row1').locator('td').nth(5).textContent();
  const trimmedStatus = status?.trim() || 'Non disponible';
  
  // Récupérer le numéro du manuscrit et le titre
  const manuscriptNumber = await contentFrame.locator('#row1').locator('td').nth(1).textContent();
  const title = await contentFrame.locator('#row1').locator('td').nth(2).textContent();
  
  // Créer le contenu du fichier status.md
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString('fr-FR', { 
    timeZone: 'Europe/Paris',
    dateStyle: 'full',
    timeStyle: 'long'
  });

  const content = `# Statut de l'article MEDNUC

Dernière vérification : ${formattedDate}

## Informations de l'article
- **Numéro du manuscrit** : ${manuscriptNumber?.trim()}
- **Titre** : ${title?.trim()}
- **État d'avancement** : ${trimmedStatus}

---
_Timestamp de vérification : ${currentDate.getTime()}_`;

  // Écrire le contenu dans le fichier
  const statusFilePath = path.join(process.cwd(), 'status.md');
  fs.writeFileSync(statusFilePath, content);
  
  console.log('État d\'avancement de l\'article:', trimmedStatus);
  console.log('Statut mis à jour dans status.md');

  // Vérifier que le statut est présent
  expect(status).toBeTruthy();
}); 