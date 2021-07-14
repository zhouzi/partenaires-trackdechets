import * as React from "react";
import { Dialog, DialogProps, TextInputField } from "evergreen-ui";

interface ImportCompanyDialogProps extends DialogProps {
  onImportCompany: (siret: string) => void;
}

export function ImportCompanyDialog({
  onImportCompany,
  ...props
}: ImportCompanyDialogProps) {
  const [siret, setSiret] = React.useState("");

  return (
    <Dialog
      {...props}
      isShown
      title="Ajouter une entreprise"
      cancelLabel="Annuler"
      confirmLabel="Ajouter"
      isConfirmDisabled={!/\d{14}/.test(siret)}
      onConfirm={() => onImportCompany(siret)}
    >
      <TextInputField
        label="SIRET de l'entreprise à ajouter"
        hint="Le SIRET doit être composé de 14 chiffres, sans espace."
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setSiret(event.target.value)
        }
        value={siret}
        pattern="\d{14}"
        required
      />
    </Dialog>
  );
}
