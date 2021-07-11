import * as React from "react";
import { SearchTableHeaderCellProps, Table } from "evergreen-ui";

interface DebouncedSearchHeaderCell extends SearchTableHeaderCellProps {}

export function DebouncedSearchHeaderCell({
  onChange,
  ...props
}: DebouncedSearchHeaderCell) {
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      onChange?.(value);
    }, 200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [onChange, value]);

  return (
    <Table.SearchHeaderCell
      {...props}
      onChange={(newValue) => setValue(newValue)}
      value={value}
    />
  );
}
