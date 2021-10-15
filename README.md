# partenaires-trackdechets

Ce site s'adresse aux entreprises ayant déjà un compte Trackdéchets et souhaitant aider leurs partenaires à s'inscrire. Les données que vous saisissez ne sont stockées que dans votre navigateur.

![](./public/assets/demo.gif)

## Installation

Afin de faire fonctionner l'application, doivent être installés sur la machine :

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

Vous pourrez ensuite installer l'application comme suit :

1. Récupérer une copie du code :

```
git clone https://github.com/Zhouzi/partenaires-trackdechets.git
```

2. Dans le répertoire de l'application, installer les dépendances :

```
yarn
```

3. Démarrer l'application en mode développement :

```
yarn dev
```

Note : cette application est basée sur [Next.js](https://nextjs.org/) et a été généré via [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Hébergement

Next.js est plus ou moins un projet Node.js classique. Le projet peut donc se déployer sans configuration chez la plupart des hébergeurs de type PaaS. Vous pouvez en apprendre plus sur la documentation de Next.js : [Deployment](https://nextjs.org/docs/deployment).

Par exemple, la version déployée sur [partenaires-trackdechets.gabin.app](https://partenaires-trackdechets.gabin.app) est hébergée gratuitement par [Heroku](https://heroku.com), sans configuration particulière.

À noter que Next.js permet un export du projet au format statique (HTML/CSS) afin de l'héberger avec un simple serveur web. Cette option n'est pas compatible avec cette application qui [utilise les routes APIs](https://github.com/Zhouzi/partenaires-trackdechets/tree/master/pages/api/) de Next.js comme proxy pour communiquer avec l'API Trackdéchets (pour des questions de CORS).
