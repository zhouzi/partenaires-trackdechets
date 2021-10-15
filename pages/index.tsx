import Head from "next/head";
import { majorScale, Pane, Heading, Paragraph, Link } from "evergreen-ui";
import { siteMetadata } from "../constants";
import { PartnersTable } from "../components";

export default function Home() {
  return (
    <>
      <Head>
        <title>{siteMetadata.title}</title>
        <meta name="description" content={siteMetadata.description} />
        <meta property="og:title" content={siteMetadata.title} />
        <meta property="og:description" content={siteMetadata.description} />
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
            Ce site s&apos;adresse aux entreprises ayant déjà un compte{" "}
            <Link href="https://trackdechets.beta.gouv.fr" target="_blank">
              Trackdéchets
            </Link>{" "}
            et souhaitant aider leurs partenaires à s&apos;inscrire. Les données
            que vous saisissez ne sont stockées que dans votre navigateur.
          </Paragraph>
          <Paragraph marginBottom={majorScale(3)}>
            Il s&apos;agit d&apos;un projet open source dont le{" "}
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
              l&apos;héberger vous même
            </Link>{" "}
            si vous souhaitez en avoir le contrôle total. Vous pouvez aussi
            simplement vous connecter à l&apos;
            <Link
              href="https://developers.trackdechets.beta.gouv.fr/"
              target="_blank"
            >
              API de Trackdéchets
            </Link>{" "}
            pour répondre à votre besoin de façon plus précise.
          </Paragraph>
          <PartnersTable />
          <Pane is="footer" display="flex">
            <Pane flex={1}>
              <Link
                href="https://github.com/zhouzi/partenaires-trackdechets"
                target="_blank"
              >
                Code source
              </Link>
            </Pane>
            <Pane>
              <Link
                href="https://trackdechets.beta.gouv.fr"
                target="_blank"
                marginRight={majorScale(1)}
              >
                Site officiel Trackdéchets
              </Link>
              <Link
                href="https://trackdechets.beta.gouv.fr/resources"
                target="_blank"
              >
                Ressources Trackdéchets
              </Link>
            </Pane>
          </Pane>
        </Pane>
      </Pane>
    </>
  );
}
