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
  const [isLoading, setIsLoading] = React.useState(false);
  const [sirets, setSirets] = React.useState<string[]>([]);

  return (
    <Dialog
      {...props}
      isShown
      title="Importer depuis un fichier .csv"
      cancelLabel="Annuler"
      confirmLabel="Importer"
      isConfirmLoading={isLoading}
      isConfirmDisabled={sirets.length <= 0}
      onConfirm={() => onImport(sirets)}
    >
      <Paragraph marginBottom={majorScale(1)}>
        Importez un fichier CSV qui liste vos partenaires, avec une colonne
        nommée &quot;siret&quot;. Note : la plupart des outils tel que Microsoft
        Excel, Google Sheets ou Libre Office permettent d&apos;enregistrer les
        fichiers au format CSV.
      </Paragraph>
      <FilePicker
        onChange={(files) => {
          if (files == null) {
            return;
          }

          setIsLoading(true);

          Papa.parse<{ siret?: string }>(files[0], {
            header: true,
            complete({ data }) {
              setSirets(
                data.reduce<string[]>((acc, row) => {
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
        placeholder="Envoyer un fichier CSV"
        accept=".csv"
      />
    </Dialog>
  );
}
