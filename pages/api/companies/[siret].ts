import { NextApiRequest, NextApiResponse } from "next";
import { gql } from "@apollo/client";
import { trackdechets } from "../../../client";
import { Company } from "../../../types";

interface QueryCompanyInfosArgs {
  siret: string;
}
interface QueryCompanyInfos {
  companyInfos: {
    siret: string;
    name: string;
    isRegistered: boolean;
  };
}
const QUERY_COMPANY_INFOS = gql`
  query QueryCompanyInfos($siret: String!) {
    companyInfos(siret: $siret) {
      siret
      name
      isRegistered
    }
  }
`;

interface ApiError {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Company | ApiError>
) {
  if (req.method === "GET") {
    if (typeof req.query.siret !== "string" || req.query.siret.length < 14) {
      res.status(400).json({
        error: "SIRET invalide",
      });
      return;
    }

    try {
      const { data } = await trackdechets.query<
        QueryCompanyInfos,
        QueryCompanyInfosArgs
      >({
        query: QUERY_COMPANY_INFOS,
        variables: { siret: req.query.siret },
      });

      const { siret, name, isRegistered } = data.companyInfos;

      res.status(200).json({
        name,
        siret,
        isRegistered,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err.message });
    }

    return;
  }

  res.status(404).end();
}
