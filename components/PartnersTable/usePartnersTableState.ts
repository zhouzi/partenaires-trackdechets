import * as React from "react";
import delay from "delay";
import { Company } from "../../types";
import { client } from "../../client";
import { usePersistedState } from "../../hooks";

const LOCAL_STORAGE_PARTNERS_TABLE_STATE_KEY = "partners";

interface PartnersTableState {
  runningTask:
    | {
        type: "importCompany";
        payload: { sirets: string[]; completedSirets: string[] };
      }
    | {
        type: "importCompanies";
        payload: { sirets: string[]; completedSirets: string[] };
      }
    | {
        type: "refreshCompanies";
        payload: { sirets: string[]; completedSirets: string[] };
      }
    | null;
  companies: Company[];
  isOutdated: boolean;
}

function serializeState(state: PartnersTableState): Record<string, any> {
  return {
    runningTask: null,
    companies: state.companies,
    isOutdated: true,
  };
}

function deserializeState(
  serializedState: Record<string, any>
): PartnersTableState {
  return {
    runningTask: null,
    companies: serializedState.companies,
    isOutdated: serializedState.isOutdated,
  };
}

function uniqueCompanies(companies: Company[]): Company[] {
  return companies.filter(
    (company, index, arr) =>
      arr.findIndex((otherCompany) => otherCompany.siret === company.siret) ===
      index
  );
}

export function usePartnersTableState() {
  const [state, setState] = usePersistedState<PartnersTableState>(
    LOCAL_STORAGE_PARTNERS_TABLE_STATE_KEY,
    {
      runningTask: null,
      companies: [],
      isOutdated: false,
    },
    serializeState,
    deserializeState
  );
  const isAbortedRef = React.useRef(false);

  const fetchCompanies = React.useCallback(
    async (
      type: "importCompany" | "importCompanies" | "refreshCompanies",
      sirets: string[]
    ) => {
      const completedSirets: string[] = [];
      const companies: Company[] = [];

      setState((currentState) => ({
        ...currentState,
        runningTask: {
          type,
          payload: {
            sirets,
            completedSirets,
          },
        },
        isOutdated:
          type === "refreshCompanies" ? false : currentState.isOutdated,
      }));

      for (const siret of sirets) {
        const existingCompany = state.companies.find(
          (company) => company.siret === siret
        );

        if (existingCompany?.isRegistered) {
          await delay(200);
        } else {
          try {
            const { data } = await client.get<Company>(`/companies/${siret}`);
            companies.push(data);
          } catch (error) {}
        }

        completedSirets.push(siret);

        if (isAbortedRef.current) {
          return;
        }

        setState((currentState) => ({
          ...currentState,
          runningTask: {
            type,
            payload: {
              sirets,
              completedSirets,
            },
          },
        }));
      }

      setState((currentState) => ({
        ...currentState,
        companies: uniqueCompanies(companies.concat(currentState.companies)),
        runningTask: null,
      }));
    },
    [state, setState]
  );

  const importCompany = (siret: string) =>
    fetchCompanies("importCompany", [siret]);

  const importCompanies = (sirets: string[]) =>
    fetchCompanies("importCompanies", sirets);

  const refreshCompanies = React.useCallback(
    (sirets: string[]) => fetchCompanies("refreshCompanies", sirets),
    [fetchCompanies]
  );

  const removeCompanies = (sirets: string[]) => {
    setState((currentState) => ({
      ...currentState,
      companies: currentState.companies.filter(
        (company) => !sirets.includes(company.siret)
      ),
    }));
  };

  React.useEffect(() => {
    const controller = new AbortController();

    controller.signal.addEventListener("abort", () => {
      isAbortedRef.current = true;
    });

    return () => {
      controller.abort();
    };
  }, []);

  React.useEffect(() => {
    if (state.isOutdated) {
      refreshCompanies(state.companies.map((company) => company.siret));
    }
  }, [refreshCompanies, state]);

  return {
    ...state,
    importCompany,
    importCompanies,
    removeCompanies,
    refreshCompanies,
  };
}
