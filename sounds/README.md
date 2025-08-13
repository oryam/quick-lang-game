
# Sons pour le jeu d'apprentissage de langues

Ce dossier contient les fichiers audio utilisés dans le jeu.

## Fichiers requis :

### 1. Musique de réflexion (thinking-music.mp3 et thinking-music.ogg)
- **Durée recommandée :** 10-15 secondes (en boucle)
- **Style :** Musique de jeu télévisé, tempo modéré, suspense léger
- **Volume :** Pas trop fort pour ne pas distraire
- **Exemples d'inspiration :** 
  - Musique de "Questions pour un champion"
  - Sons d'horloge de jeux de réflexion
  - Musique de fond de "Qui veut gagner des millions"

### 2. Son de révélation (tada.mp3 et tada.ogg)
- **Durée :** 1-3 secondes maximum
- **Style :** Son de victoire/révélation court et joyeux
- **Exemples :**
  - Son "Ta-da!" classique
  - Carillon de victoire
  - Son de "bonne réponse" de jeu télévisé

## Comment ajouter les fichiers :

1. Placez les fichiers audio dans ce dossier (`public/sounds/`)
2. Nommez-les exactement :
   - `thinking-music.mp3` et `thinking-music.ogg`
   - `tada.mp3` et `tada.ogg`
3. Les formats MP3 et OGG assurent la compatibilité avec tous les navigateurs

## Génération des sons :

Vous pouvez :
- Utiliser des bibliothèques de sons libres (Freesound, Zapsplat)
- Créer vos propres sons avec des outils comme Audacity
- Utiliser des générateurs de sons en ligne
- Acheter des sons de qualité professionnelle

## Note technique :

Les sons sont chargés avec `preload="auto"` pour éviter les délais de chargement pendant le jeu.
