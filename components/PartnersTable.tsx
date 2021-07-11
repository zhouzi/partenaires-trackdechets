import * as React from "react";
import {
  majorScale,
  Pane,
  Heading,
  Paragraph,
  Button,
  UploadIcon,
  RefreshIcon,
  PlusIcon,
  Table,
  Small,
  TickIcon,
  CrossIcon,
  TrashIcon,
  Tooltip,
} from "evergreen-ui";
import * as localStorage from "local-storage";
import Fuse from "fuse.js";
import { Company } from "../types";
import { client } from "../client";
import { DebouncedSearchHeaderCell } from "./DebouncedSearchHeaderCell";
import { ImportCompaniesDialog } from "./ImportCompaniesDialog";
import { AddPartnerDialog } from "./AddPartnerDialog";

const LOCAL_STORAGE_PARTNERS_KEY = "partners";

function uniqueCompanies(companies: Company[]): Company[] {
  return companies.filter(
    (company, index, arr) =>
      arr.findIndex((otherCompany) => otherCompany.siret === company.siret) ===
      index
  );
}

type Task =
  | { name: "addCompany"; payload: string }
  | { name: "refreshCompanies"; payload: string[] }
  | { name: "importCompanies"; payload: string[]; meta: { done: string[] } };

interface PartnersTableState {
  task: Task | null;
  companies: Company[];
}

const initialState: PartnersTableState = {
  task: null,
  companies: [],
};

type ReducerAction =
  | { type: "taskStart"; payload: Task }
  | { type: "taskUpdate"; payload: Task }
  | { type: "taskComplete" }
  | { type: "addCompany"; payload: Company }
  | { type: "addCompanies"; payload: Company[] }
  | { type: "updateCompanies"; payload: Company[] }
  | { type: "removeCompany"; payload: Company };

function reducer(state: PartnersTableState, action: ReducerAction) {
  switch (action.type) {
    case "taskStart": {
      if (state.task == null) {
        return {
          ...state,
          task: action.payload,
        };
      }
    }
    case "taskUpdate": {
      if (state.task?.name === action.payload.name) {
        return {
          ...state,
          task: action.payload,
        };
      }
    }
    case "taskComplete": {
      return {
        ...state,
        task: null,
      };
    }
    case "addCompany": {
      return {
        ...state,
        companies: uniqueCompanies([action.payload].concat(state.companies)),
      };
    }
    case "addCompanies": {
      return {
        ...state,
        companies: uniqueCompanies(action.payload.concat(state.companies)),
      };
    }
    case "removeCompany": {
      return {
        ...state,
        companies: state.companies.filter(
          (otherCompany) => otherCompany.siret !== action.payload.siret
        ),
      };
    }
    case "updateCompanies": {
      return {
        ...state,
        companies: uniqueCompanies(action.payload.concat(state.companies)),
      };
    }
    default:
      return state;
  }
}

export function PartnersTable() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [filter, setFilter] = React.useState("");
  const [isAddingCompany, setIsAddingCompany] = React.useState(false);
  const [isImportingCompanies, setIsImportingCompanies] = React.useState(false);

  React.useEffect(() => {
    const serializedCompanies = localStorage.get<Company[] | undefined>(
      LOCAL_STORAGE_PARTNERS_KEY
    );

    if (serializedCompanies == null) {
      return;
    }

    dispatch({
      type: "addCompanies",
      payload: serializedCompanies,
    });
  }, []);

  React.useEffect(() => {
    localStorage.set(LOCAL_STORAGE_PARTNERS_KEY, state.companies);
  }, [state]);

  const currentTask = state.task;
  React.useEffect(() => {
    if (currentTask == null) {
      return;
    }

    let aborted = false;
    const controller = new AbortController();

    controller.signal.addEventListener("abort", () => {
      aborted = true;
    });

    switch (currentTask.name) {
      case "addCompany": {
        (async () => {
          try {
            const { data } = await client.get(
              `/companies/${currentTask.payload}`
            );

            if (aborted) {
              return;
            }

            dispatch({
              type: "addCompany",
              payload: data,
            });
          } catch (error) {}

          dispatch({ type: "taskComplete" });
        })();
        break;
      }
      case "refreshCompanies": {
        (async () => {
          const refreshedCompanies = [];

          for (const siret of currentTask.payload) {
            try {
              const { data } = await client.get(`/companies/${siret}`);

              if (aborted) {
                return;
              }

              refreshedCompanies.push(data);
            } catch (error) {}
          }

          dispatch({ type: "updateCompanies", payload: refreshedCompanies });
          dispatch({ type: "taskComplete" });
        })();
        break;
      }
      case "importCompanies": {
        (async () => {
          const done = [];
          const importedCompanies = [];

          for (const siret of currentTask.payload) {
            try {
              const { data } = await client.get(`/companies/${siret}`);

              if (aborted) {
                return;
              }

              importedCompanies.push(data);
            } catch (error) {}

            done.push(siret);

            dispatch({
              type: "taskUpdate",
              payload: {
                name: "importCompanies",
                payload: currentTask.payload,
                meta: { done },
              },
            });
          }

          dispatch({ type: "addCompanies", payload: importedCompanies });
          dispatch({ type: "taskComplete" });
        })();
        break;
      }
      default:
        break;
    }

    return () => {
      controller.abort();
    };
  }, [currentTask?.name]);

  const companies = React.useMemo(
    () =>
      filter.length > 0
        ? new Fuse(state.companies, {
            keys: ["siret", "name"],
          })
            .search(filter)
            .map(({ item }) => item)
        : state.companies,
    [state.companies, filter]
  );

  const onChangeFilter = React.useCallback(
    (value) => setFilter(value),
    [setFilter]
  );

  return (
    <>
      <Pane
        padding={majorScale(2)}
        background="white"
        borderRadius={3}
        elevation={1}
      >
        <Pane marginBottom={majorScale(3)}>
          <Heading size={600}>Mes partenaires</Heading>
          <Paragraph>
            Importez la liste de vos partenaires et découvrez lesquels sont déjà
            inscrits sur Trackdéchets.
          </Paragraph>
        </Pane>
        <Pane display="flex" marginBottom={majorScale(1)}>
          <Pane flex={1}>
            {state.task?.name === "importCompanies" ? (
              <Button
                type="button"
                appearance="primary"
                marginRight={majorScale(1)}
                disabled
                isLoading
              >
                Importation depuis un fichier ({state.task.meta.done.length}/
                {state.task.payload.length})...
              </Button>
            ) : (
              <Button
                type="button"
                iconBefore={UploadIcon}
                appearance="primary"
                marginRight={majorScale(1)}
                onClick={() => setIsImportingCompanies(true)}
                disabled={Boolean(state.task)}
              >
                Importer depuis un fichier
              </Button>
            )}
            {state.task?.name === "addCompany" ? (
              <Button type="button" disabled isLoading>
                Ajout d&apos;une entreprise...
              </Button>
            ) : (
              <Button
                type="button"
                iconBefore={PlusIcon}
                onClick={() => setIsAddingCompany(true)}
                disabled={Boolean(state.task)}
              >
                Ajouter une entreprise
              </Button>
            )}
          </Pane>
          <Pane>
            {state.task?.name === "refreshCompanies" ? (
              <Button type="button" appearance="minimal" disabled isLoading>
                Rafraîchissement...
              </Button>
            ) : (
              <Button
                type="button"
                iconBefore={RefreshIcon}
                appearance="minimal"
                onClick={() =>
                  dispatch({
                    type: "taskStart",
                    payload: {
                      name: "refreshCompanies",
                      payload: state.companies
                        .filter((company) => !company.isRegistered)
                        .map((company) => company.siret),
                    },
                  })
                }
                disabled={Boolean(state.task)}
              >
                Rafraîchir
              </Button>
            )}
          </Pane>
        </Pane>
        <Table>
          <Table.Head>
            <DebouncedSearchHeaderCell onChange={onChangeFilter} />
          </Table.Head>
          <Table.VirtualBody height="400px">
            {companies.map((company) => (
              <Table.Row
                key={company.siret}
                intent={company.isRegistered ? undefined : "warning"}
              >
                <Table.TextCell>
                  <Small>{company.siret}</Small>
                  <br />
                  {company.name}
                </Table.TextCell>
                <Table.Cell
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  {company.isRegistered ? (
                    <Tooltip content="Cette entreprise est inscrite sur Trackdéchets.">
                      <TickIcon color="success" />
                    </Tooltip>
                  ) : (
                    <Tooltip content="Cette entreprise n'est pas inscrite sur Trackdéchets.">
                      <CrossIcon color="danger" />
                    </Tooltip>
                  )}
                  <Button
                    iconBefore={TrashIcon}
                    intent="danger"
                    marginLeft={majorScale(1)}
                    onClick={() => {
                      if (
                        window.confirm(
                          `Êtes-vous sûr de vouloir supprimer l'entreprise ${company.name} (${company.siret}) de votre liste de partenaires ?`
                        )
                      ) {
                        dispatch({
                          type: "removeCompany",
                          payload: company,
                        });
                      }
                    }}
                    disabled={state.task != null}
                  >
                    Supprimer
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.VirtualBody>
        </Table>
      </Pane>
      {isAddingCompany && (
        <AddPartnerDialog
          onCloseComplete={() => setIsAddingCompany(false)}
          onAddPartner={(siret) => {
            dispatch({
              type: "taskStart",
              payload: {
                name: "addCompany",
                payload: siret,
              },
            });
            setIsAddingCompany(false);
          }}
        />
      )}
      {isImportingCompanies && (
        <ImportCompaniesDialog
          onCloseComplete={() => setIsImportingCompanies(false)}
          onImportCompanies={(sirets) => {
            dispatch({
              type: "taskStart",
              payload: {
                name: "importCompanies",
                payload: sirets,
                meta: { done: [] },
              },
            });
            setIsImportingCompanies(false);
          }}
        />
      )}
    </>
  );
}
