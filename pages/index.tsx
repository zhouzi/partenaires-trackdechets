import Head from "next/head";
import { majorScale, Pane, Heading, Paragraph, Link } from "evergreen-ui";
import { PartnersTable } from "../components";

export default function Home() {
  return (
    <>
      <Head>
        <title>Embarquer mes partenaires Trackdéchets</title>
        <meta
          name="description"
          content="Ce site regroupe des outils permettant aux entreprises inscrites sur Trackdéchets d'embarquer leurs partenaires plus facilement. Retrouvez vos partenaires, voyez lesquels sont inscrits et accédez à une liste de ressources adaptées selon leur profil."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Pane background="tint2" minHeight="100vh">
        <Pane
          maxWidth="46rem"
          margin="auto"
          paddingX={majorScale(1)}
          paddingY={majorScale(6)}
        >
          <Heading size={800} marginBottom={majorScale(1)}>
            Embarquer mes partenaires Trackdéchets
          </Heading>
          <Paragraph marginBottom={majorScale(1)}>
            Ce site s'adresse aux entreprises ayant déjà un compte{" "}
            <Link href="https://trackdechets.beta.gouv.fr" target="_blank">
              Trackdéchets
            </Link>{" "}
            et souhaitant aider leurs partenaires à s'inscrire. Les données que
            vous saisissez ne sont stockées que dans votre navigateur.
          </Paragraph>
          <Paragraph marginBottom={majorScale(3)}>
            Il s'agit d'un projet open source dont le{" "}
            <Link
              href="https://github.com/zhouzi/partenaires-trackdechets"
              target="_blank"
            >
              code est public
            </Link>
            . Vous pouvez choisir de{" "}
            <Link
              href="https://github.com/zhouzi/partenaires-trackdechets#readme"
              target="_blank"
            >
              l'héberger vous même
            </Link>{" "}
            si vous souhaitez en avoir le contrôle total. Vous pouvez aussi
            simplement vous connecter à l'
            <Link
              href="https://developers.trackdechets.beta.gouv.fr/"
              target="_blank"
            >
              API de Trackdéchets
            </Link>{" "}
            pour répondre à votre besoin de façon plus précise.
          </Paragraph>
          <PartnersTable />
        </Pane>
      </Pane>
    </>
  );
}
