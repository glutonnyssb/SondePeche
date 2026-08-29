# Rivage — carnet de pêche

Carnet de sorties personnel. Tu enregistres où, quand, comment tu as pêché et ce que ça a donné.
L'appli va chercher toute seule la pression, sa tendance sur 6 h, la température, le vent, la
couverture nuageuse et la phase lunaire à partir du GPS et de l'horodatage. Ensuite elle compare
les conditions du moment à tes sorties passées.

Une sortie peut contenir plusieurs lignes de résultat : indique séparément le nombre, l'espèce et
la taille maximale pour chaque type de poisson pris.

Tout tourne côté navigateur. Aucun serveur, aucun compte, aucune donnée qui sort de ton téléphone
(à part les coordonnées envoyées à Open-Meteo pour la météo).

## Mise en ligne sur GitHub Pages

1. Crée un dépôt public sur GitHub, par exemple `rivage`.
2. Dépose les cinq fichiers à la racine : `index.html`, `manifest.webmanifest`, `sw.js`,
   `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`.
3. Onglet **Settings → Pages**. Dans *Source*, choisis **Deploy from a branch**,
   branche `main`, dossier `/ (root)`. Enregistre.
4. Une minute plus tard, l'adresse `https://<ton-pseudo>.github.io/rivage/` répond.

HTTPS est obligatoire pour le GPS et le mode hors-ligne — GitHub Pages le fournit d'office.

## Installation sur le téléphone

- **Android / Chrome** : ouvre l'adresse, menu ⋮ → *Ajouter à l'écran d'accueil*.
- **iOS / Safari** : ouvre l'adresse, bouton Partager → *Sur l'écran d'accueil*.
  Sur iPhone, l'installation ne marche que depuis Safari, pas depuis Chrome.

Une fois installée, l'appli démarre sans réseau. Si tu enregistres une sortie hors couverture,
elle est conservée et la météo se complète automatiquement au retour du réseau.

## Sauvegarde — à ne pas négliger

Les données vivent dans le stockage local du navigateur. Vider le cache du site, désinstaller
l'appli ou changer de téléphone efface tout. Le bouton **Exporter (JSON)** dans l'onglet Journal
produit un fichier de sauvegarde ; **Importer** le relit et fusionne sans créer de doublons.

Prends l'habitude d'exporter en fin de saison.

## Modifier l'appli

Tout est dans `index.html` — CSS, HTML et JavaScript dans un seul fichier.

Les listes déroulantes se modifient en haut du bloc `<script>` : `EAUX`, `TECHNIQUES`,
`COUCHES`, `ESPECES`. Ajoute tes espèces et tes montages, ça vaut mieux que « Autre ».

La pondération de la comparaison se trouve dans `scoreSimilarite()`. Chaque ligne `add()`
prend un écart, une tolérance et un poids. Exemple :

```js
add(sousTraire(cible.pression, m.pression), 14, 3);
//                                          ↑    ↑
//                              tolérance en hPa  poids relatif
```

Une tolérance de 14 hPa signifie qu'un écart de 14 hPa fait tomber la note de ce critère à zéro.
Un poids de 3 rend le critère trois fois plus important qu'un critère de poids 1. Rien de tout
ça n'est établi scientifiquement — ce sont des réglages de départ, à ajuster quand tu auras assez
de sorties pour voir ce qui compte réellement chez toi.

**Après chaque modification de `index.html`, incrémente `VERSION` dans `sw.js`.** Sans ça, le
service worker continue de servir l'ancienne version depuis le cache et tu ne verras pas
tes changements.

## Ce que l'appli ne fait pas

- Pas de température de l'eau : aucune API gratuite ne la donne pour une rivière ou un étang
  quelconque. Si c'est important pour toi, ajoute un champ manuel — c'est probablement la
  variable la plus prédictive pour le carnassier.
- Pas de photos : le stockage local est limité à environ 5 Mo, quelques photos le rempliraient.
- Pas de réglementation : dates d'ouverture, tailles légales et parcours particuliers restent
  à vérifier auprès de l'AAPPMA et de l'arrêté préfectoral de ton département.

## Honnêteté sur les statistiques

Avec moins d'une trentaine de sorties, les moyennes affichées dans l'onglet Analyse ne veulent
pas dire grand-chose. Un leurre à « 2,0 prises par sortie » sur deux sorties, c'est du bruit.
L'appli affiche le nombre de sorties à côté de chaque moyenne pour cette raison : lis toujours
les deux ensemble.

Enregistre les bredouilles. Un carnet qui ne contient que les bons jours ne peut rien t'apprendre.
