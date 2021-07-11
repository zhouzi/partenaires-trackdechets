import * as React from "react";
import { Dialog, DialogProps, TextInputField } from "evergreen-ui";

interface AddPartnerDialogProps extends DialogProps {
  onAddPartner: (siret: string) => void;
}

export function AddPartnerDialog({
  onAddPartner,
  ...props
}: AddPartnerDialogProps) {
  const [siret, setSiret] = React.useState("");
  const [error, setError] = React.useState<Error | null>(null);

  return (
    <Dialog
      {...props}
      isShown
      title="Ajouter une entreprise"
      confirmLabel="Ajouter"
      onConfirm={() => {
        if (/\d{14}/.test(siret)) {
          onAddPartner(siret);
          return;
        }
        setError(new Error("Le SIRET ne respect pas le format attendu."));
      }}
    >
      <TextInputField
        label="SIRET de l'entreprise à ajouter"
        hint="Le SIRET doit être composé de 14 chiffres, sans espace."
        validationMessage={error?.message}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSiret(event.target.value);
          setError(null);
        }}
        value={siret}
        pattern="\d{14}"
        required
      />
    </Dialog>
  );
}
