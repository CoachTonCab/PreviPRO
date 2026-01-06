# Instructions pour déployer sur GitHub Pages

## Après avoir créé le dépôt sur GitHub :

1. **Connecter votre projet local à GitHub** (remplacez VOTRE_USERNAME par votre nom d'utilisateur GitHub) :

```bash
git remote add origin https://github.com/VOTRE_USERNAME/simulateur-previsionnel.git
git branch -M main
git push -u origin main
```

2. **Activer GitHub Pages** :
   - Allez sur votre dépôt GitHub
   - Cliquez sur "Settings" (Paramètres)
   - Dans le menu de gauche, cliquez sur "Pages"
   - Sous "Source", sélectionnez "Deploy from a branch"
   - Choisissez "main" comme branche et "/ (root)" comme dossier
   - Cliquez sur "Save"

3. **Votre site sera disponible à l'adresse** :
   - https://VOTRE_USERNAME.github.io/simulateur-previsionnel/

⚠️ **Note** : Il peut falloir quelques minutes pour que le site soit accessible.

## Pour mettre à jour votre site après des modifications :

```bash
git add .
git commit -m "Description de vos modifications"
git push
```

Le site se mettra à jour automatiquement en quelques minutes.

