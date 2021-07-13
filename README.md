# partenaires-trackdechets

Application web listant des outils ayant pour objectif de faciliter l'embarquement de ses partenaires Trackdéchets.

## Installation

Il s'agit d'un projet [Next.js](https://nextjs.org/) qui a été créé via [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). Pour en installer une copie sur votre machine, vous devez :

- Avoir Node.js et yarn d'installés
- En récupérer une copie
- Dans le répertoire du projet :
  - Jouer la commande `yarn`
  - Puis jouer la commande `yarn dev` pour démarrer l'application

## Hébergement

Next.js est plus ou moins un projet Node.js classique. Le projet peut donc se déployer sans configuration chez la plupart des hébergeurs de type PaaS. Vous pouvez en apprendre plus sur la documentation de Next.js : [Deployment](https://nextjs.org/docs/deployment).

Par exemple, la version déployée sur [partenaires-trackdechets.gabin.app](https://partenaires-trackdechets.gabin.app) est hébergée gratuitement par [Heroku](https://heroku.com), sans configuration particulière.

À noter que Next.js permet un export du projet au format statique (HTML/CSS) qui permet en théorie de l'héberger avec un simple serveur web. Cette option n'est pas compatible avec le projet qui utilise les routes APIs de Next.js comme proxy pour communiquer avec l'API Trackdéchets (pour des questions de CORS).
