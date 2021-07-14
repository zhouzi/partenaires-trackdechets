import * as React from "react";
import {
  majorScale,
  Dialog,
  DialogProps,
  Paragraph,
  FilePicker,
} from "evergreen-ui";
import Papa from "papaparse";

interface ImportDialogProps extends DialogProps {
  onImport: (sirets: string[]) => void;
}

export function ImportDialog({ onImport, ...props }: ImportDialogProps) {
  const [state, setState] = React.useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "loaded"; sirets: string[]; summary: string }
  >({
    status: "idle",
  });

  return (
    <Dialog
      {...props}
      isShown
      title="Importer depuis un fichier .csv"
      cancelLabel="Annuler"
      confirmLabel="Importer"
      isConfirmLoading={state.status === "loading"}
      isConfirmDisabled={state.status !== "loaded" || state.sirets.length <= 0}
      onConfirm={() => {
        if (state.status === "loaded" && state.sirets.length > 0) {
          onImport(state.sirets);
        }
      }}
    >
      <Paragraph marginBottom={majorScale(1)}>
        Importez un fichier CSV qui liste vos partenaires, avec une colonne
        nommée &quot;siret&quot; et composée de 14 chiffres, sans espace. Note :
        la plupart des outils tel que Microsoft Excel, Google Sheets ou Libre
        Office permettent d&apos;enregistrer les fichiers au format CSV.
      </Paragraph>
      <FilePicker
        onChange={(files) => {
          if (files == null) {
            return;
          }

          setState({ status: "loading" });

          Papa.parse<{ siret?: string }>(files[0], {
            header: true,
            complete({ data }) {
              const [firstRow] = data;

              if (firstRow == null) {
                setState({
                  status: "loaded",
                  sirets: [],
                  summary:
                    "Votre fichier ne contient aucune ligne ou n'a pas pu être lu.",
                });
                return;
              }

              if (!firstRow.hasOwnProperty("siret")) {
                setState({
                  status: "loaded",
                  sirets: [],
                  summary: `Votre fichier ne contient pas de colonne "siret".`,
                });
                return;
              }

              const { sirets, invalidRows } = data.reduce<{
                sirets: string[];
                invalidRows: number[];
              }>(
                (acc, row, index) => {
                  if (
                    typeof row.siret === "string" &&
                    row.siret.length === 14
                  ) {
                    return acc.sirets.includes(row.siret)
                      ? acc
                      : {
                          ...acc,
                          sirets: acc.sirets.concat(row.siret),
                        };
                  }
                  return {
                    ...acc,
                    invalidRows: acc.invalidRows.concat([index + 1]),
                  };
                },
                { sirets: [], invalidRows: [] }
              );

              setState({
                status: "loaded",
                sirets,
                summary: `${
                  sirets.length
                } entreprise(s) ont été retrouvée(s) parmi les ${
                  data.length
                } ligne(s) de votre fichier. ${
                  invalidRows.length > 0
                    ? invalidRows.length > 1
                      ? `${invalidRows.length} lignes n'avaient pas de SIRET au format attendu.`
                      : `1 ligne n'avait pas de SIRET au format attendu.`
                    : ""
                }`,
              });
            },
          });
        }}
        placeholder="Envoyer un fichier CSV"
        accept=".csv"
      />
      {state.status === "loading" ? (
        <Paragraph marginTop={majorScale(1)}>
          Lecture de votre fichier...
        </Paragraph>
      ) : state.status === "loaded" ? (
        <Paragraph marginTop={majorScale(1)}>{state.summary}</Paragraph>
      ) : null}
    </Dialog>
  );
}
