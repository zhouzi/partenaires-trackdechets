import * as React from "react";
import {
  majorScale,
  Dialog,
  DialogProps,
  Paragraph,
  FilePicker,
  Small,
} from "evergreen-ui";
import Papa from "papaparse";

interface ImportCompaniesDialogProps extends DialogProps {
  onImportCompanies: (sirets: string[]) => void;
}

export function ImportCompaniesDialog({
  onImportCompanies,
  ...props
}: ImportCompaniesDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [sirets, setSirets] = React.useState<string[]>([]);

  return (
    <Dialog
      {...props}
      isShown
      title="Importer depuis un fichier"
      confirmLabel={"Importer"}
      isConfirmLoading={isLoading}
      onConfirm={() => {
        onImportCompanies(sirets);
      }}
    >
      <Paragraph marginBottom={majorScale(1)}>
        Importez la liste de vos partenaires via un fichier CSV. Le fichier doit
        contenir une colonne nommée &quot;siret&quot;.
      </Paragraph>
      <Paragraph marginBottom={majorScale(1)}>
        Note : la plupart des éditeurs du type Excel et Libre Office permettent
        d&apos;exporter vos feuilles au format CSV.
      </Paragraph>
      <FilePicker
        onChange={(files) => {
          if (files == null) {
            return;
          }

          setIsLoading(true);

          Papa.parse<Record<string, any>>(files[0], {
            header: true,
            complete({ data: rows }) {
              setSirets(
                rows.reduce<string[]>((acc, row) => {
                  if (
                    typeof row.siret === "string" &&
                    row.siret.length === 14
                  ) {
                    return acc.includes(row.siret)
                      ? acc
                      : acc.concat([row.siret]);
                  }
                  return acc;
                }, [])
              );
              setIsLoading(false);
            },
          });
        }}
        accept=".csv"
        placeholder="Envoyer un fichier tableur"
      />
    </Dialog>
  );
}
