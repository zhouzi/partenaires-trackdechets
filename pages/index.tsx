import Head from "next/head";
import { majorScale, Pane, Heading, Paragraph } from "evergreen-ui";
import { PartnersTable } from "../components";

const siteMetadata = {
  title: "Embarquer mes partenaires Trackdéchets",
  description:
    "Ce site propose des outils ayant pour objectif de faciliter l'adoption de Trackdéchets.",
};

export default function Home() {
  return (
    <>
      <Head>
        <title>{siteMetadata.title}</title>
        <meta name="description" content={siteMetadata.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Pane background="tint2" minHeight="100vh">
        <Pane
          maxWidth="46rem"
          margin="auto"
          paddingX={majorScale(1)}
          paddingY={majorScale(6)}
        >
          <Heading size={800}>{siteMetadata.title}</Heading>
          <Paragraph marginBottom={majorScale(3)}>
            {siteMetadata.description}
          </Paragraph>
          <PartnersTable />
        </Pane>
      </Pane>
    </>
  );
}
