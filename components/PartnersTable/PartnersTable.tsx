/* eslint-disable react/jsx-key */
import * as React from "react";
import {
  majorScale,
  Pane,
  Heading,
  Paragraph,
  Button,
  UploadIcon,
  RefreshIcon,
  Table,
  Small,
  TickIcon,
  CrossIcon,
  Pagination,
  Popover,
  Menu,
  Position,
  FilterIcon,
  IconButton,
  Checkbox,
  TrashIcon,
  PlusIcon,
  Tooltip,
} from "evergreen-ui";
import {
  CellProps,
  Column,
  useTable,
  usePagination,
  useFilters,
  FilterProps,
  useRowSelect,
} from "react-table";
import { Company } from "../../types";
import { ImportDialog } from "./ImportDialog";
import { ImportCompanyDialog } from "./ImportCompanyDialog";
import { usePartnersTableState } from "./usePartnersTableState";

function IsRegisteredFilter({
  column: { filterValue, setFilter },
}: FilterProps<Company>) {
  return (
    <Popover
      position={Position.BOTTOM_LEFT}
      content={
        <Menu>
          <Menu.OptionsGroup
            title="Filtrer"
            options={[
              { label: "Tout", value: undefined },
              { label: "Inscrit", value: true },
              { label: "Pas inscrit", value: false },
            ]}
            selected={filterValue}
            onChange={(selected) => setFilter(selected)}
          />
        </Menu>
      }
    >
      <IconButton
        icon={FilterIcon}
        appearance="minimal"
        marginLeft={majorScale(1)}
      />
    </Popover>
  );
}

const columns: Array<Column<Company>> = [
  {
    accessor: "name",
    Cell({ row: { original: company } }) {
      return (
        <>
          <Small>{company.siret}</Small>
          <br />
          {company.name}
        </>
      );
    },
    disableFilters: true,
  },
  {
    accessor: "isRegistered",
    Header: "Inscrit sur Trackdéchets",
    Cell({ row: { original: company } }) {
      return (
        <>
          {company.isRegistered ? (
            <Tooltip content="Cette entreprise est inscrite sur Trackdéchets.">
              <TickIcon color="success" />
            </Tooltip>
          ) : (
            <Tooltip content="Cette entreprise est inscrite sur Trackdéchets.">
              <CrossIcon color="danger" />
            </Tooltip>
          )}
        </>
      );
    },
    Filter: IsRegisteredFilter,
    filter: "equals",
  },
];

export function PartnersTable() {
  const {
    companies,
    runningTask,
    importCompany,
    importCompanies,
    removeCompanies,
    refreshCompanies,
  } = usePartnersTableState();
  const [isImportDialogShown, setIsImportDialogShown] = React.useState(false);
  const [isImportCompanyDialogShown, setIsImportCompanyDialogShown] =
    React.useState(false);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageCount,
    previousPage,
    nextPage,
    gotoPage,
    state: { pageIndex },
    selectedFlatRows,
  } = useTable(
    { columns, data: companies, initialState: { pageSize: 10 } },
    useFilters,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header({ getToggleAllRowsSelectedProps }) {
            return <Checkbox {...getToggleAllRowsSelectedProps()} />;
          },
          Cell({ row }: CellProps<Company>) {
            return <Checkbox {...row.getToggleRowSelectedProps()} />;
          },
        },
        ...columns,
      ]);
    }
  );

  return (
    <>
      <Pane
        elevation={1}
        background="white"
        borderRadius={3}
        padding={majorScale(2)}
      >
        <Heading size={600}>Mes partenaires</Heading>
        <Paragraph marginBottom={majorScale(2)}>
          Retrouvez vos partenaires et voyez si ils sont déjà inscrits sur
          Trackdéchets.
        </Paragraph>
        <Pane display="flex" marginBottom={majorScale(1)}>
          <Pane flex={1}>
            {runningTask?.type === "importCompanies" ? (
              <Button type="button" appearance="primary" isLoading disabled>
                Importation d&apos;un fichier (
                {runningTask.payload.completedSirets.length}/
                {runningTask.payload.sirets.length})...
              </Button>
            ) : (
              <Button
                type="button"
                iconBefore={UploadIcon}
                appearance="primary"
                onClick={() => setIsImportDialogShown(true)}
                disabled={runningTask != null}
              >
                Importer depuis un fichier .csv
              </Button>
            )}
            {runningTask?.type === "importCompany" ? (
              <Button
                type="button"
                isLoading
                disabled
                marginLeft={majorScale(1)}
              >
                Ajout d&apos;une entreprise...
              </Button>
            ) : (
              <Button
                type="button"
                iconBefore={PlusIcon}
                onClick={() => setIsImportCompanyDialogShown(true)}
                disabled={runningTask != null}
                marginLeft={majorScale(1)}
              >
                Ajouter une entreprise
              </Button>
            )}
          </Pane>
          <Pane>
            {runningTask?.type === "refreshCompanies" ? (
              <Button type="button" appearance="minimal" isLoading disabled>
                Rafraîssement ({runningTask.payload.completedSirets.length}/
                {runningTask.payload.sirets.length})...
              </Button>
            ) : (
              <Button
                type="button"
                iconBefore={RefreshIcon}
                appearance="minimal"
                onClick={() =>
                  refreshCompanies(companies.map((company) => company.siret))
                }
                disabled={runningTask != null}
              >
                Rafraîchir
              </Button>
            )}
          </Pane>
        </Pane>

        {selectedFlatRows.length > 0 && (
          <Pane
            display="flex"
            alignItems="center"
            marginBottom={majorScale(1)}
            padding={majorScale(2)}
            background="blueTint"
            borderRadius={3}
          >
            <Pane flex={1}>
              <Paragraph>
                {selectedFlatRows.length} entreprise(s) sélectionnée(s).
              </Paragraph>
            </Pane>
            <Pane>
              <Button
                intent="danger"
                iconBefore={TrashIcon}
                onClick={() => {
                  if (
                    window.confirm(
                      `Êtes-vous sûr de vouloir retirer ${selectedFlatRows.length} entreprise(s) de vos partenaires ?`
                    )
                  ) {
                    removeCompanies(
                      selectedFlatRows.map(
                        ({ original: company }) => company.siret
                      )
                    );
                  }
                }}
              >
                Supprimer
              </Button>
            </Pane>
          </Pane>
        )}

        <Table {...getTableProps()}>
          {headerGroups.map((headerGroup) => (
            <Table.Head {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                if (column.id === "selection") {
                  return (
                    <Table.Cell {...column.getHeaderProps()} flex="none">
                      {column.render("Header")}
                    </Table.Cell>
                  );
                }
                return (
                  <Table.HeaderCell
                    {...column.getHeaderProps()}
                    alignItems="center"
                  >
                    {column.render("Header")}
                    {column.canFilter ? column.render("Filter") : null}
                  </Table.HeaderCell>
                );
              })}
            </Table.Head>
          ))}
          <Table.Body {...getTableBodyProps()}>
            {page.length > 0 ? (
              page.map((row) => {
                prepareRow(row);

                return (
                  <Table.Row
                    {...row.getRowProps()}
                    intent={row.original.isRegistered ? undefined : "warning"}
                  >
                    {row.cells.map((cell) => {
                      if (cell.column.id === "selection") {
                        return (
                          <Table.Cell {...cell.getCellProps()} flex="none">
                            {cell.render("Cell")}
                          </Table.Cell>
                        );
                      }

                      return (
                        <Table.TextCell {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </Table.TextCell>
                      );
                    })}
                  </Table.Row>
                );
              })
            ) : (
              <Table.Row>
                <Table.TextCell>Aucun résultat.</Table.TextCell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        <Pane display="flex" justifyContent="flex-end">
          <Pagination
            page={pageIndex + 1}
            totalPages={pageCount}
            onNextPage={nextPage}
            onPreviousPage={previousPage}
            onPageChange={(page) => gotoPage(page - 1)}
          />
        </Pane>
      </Pane>

      {isImportDialogShown && (
        <ImportDialog
          onCloseComplete={() => setIsImportDialogShown(false)}
          onImport={(sirets) => {
            setIsImportDialogShown(false);
            importCompanies(sirets);
          }}
        />
      )}

      {isImportCompanyDialogShown && (
        <ImportCompanyDialog
          onCloseComplete={() => setIsImportCompanyDialogShown(false)}
          onImportCompany={(siret) => {
            setIsImportCompanyDialogShown(false);
            importCompany(siret);
          }}
        />
      )}
    </>
  );
}
