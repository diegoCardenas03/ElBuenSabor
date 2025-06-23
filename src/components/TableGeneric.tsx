import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { useEffect, useState } from "react";
import { ButtonsTable } from "./ButtonsTable/ButtonsTable";
import { useAppSelector } from "../hooks/redux";

// Definimos la interfaz para cada columna de la tabla
interface ITableColumn<T> {
  label: string;
  key: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

export interface ITableProps<T> {
  columns: ITableColumn<T>[];
  handleDelete: (id: number) => void;
  setOpenModal: (state: boolean) => void;
  getRowClassName?: (row: T) => string;
}

export const TableGeneric = <T extends { id: any }>({
  columns,
  handleDelete,
  setOpenModal,
  getRowClassName,
}: ITableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>(columns[0]?.key || '');
  const [filter, setFilter] = useState('');
  const [rows, setRows] = useState<any[]>([]);
  const dataTable = useAppSelector((state) => state.tablaReducer.dataTable);

  useEffect(() => {
    setRows(dataTable);
  }, [dataTable]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Filtro
  const filteredRows = rows.filter((row) =>
    columns.some((col) =>
      String(row[col.key]).toLowerCase().includes(filter.toLowerCase())
    )
  );

  // Orden
  const getComparator = (order: 'asc' | 'desc', orderBy: string) =>
    order === 'desc'
      ? (a: any, b: any) => (b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0)
      : (a: any, b: any) => (a[orderBy] < b[orderBy] ? -1 : a[orderBy] > b[orderBy] ? 1 : 0);

  const sortedRows = [...filteredRows].sort(getComparator(order, orderBy));

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      
      {/* Contenedor del componente Paper */}
      <Paper sx={{ width: "90%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "80vh" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column, i: number) => (
                  <TableCell
                    key={i}
                    align={"center"}
                    className={column.className}
                    sortDirection={orderBy === column.key ? order : false}
                    sx={{
                      cursor: "pointer",
                      userSelect: "none",
                      display: {
                        xs: column.className?.includes("hidden") ? "none" : "table-cell",
                        sm: "table-cell",
                      },
                    }}
                    onClick={() => handleRequestSort(column.key)}
                  >
                    <TableSortLabel
                      active={orderBy === column.key}
                      direction={orderBy === column.key ? order : 'asc'}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index: number) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                    className={getRowClassName ? getRowClassName(row) : ""}
                  >
                    {columns.map((column, i: number) => (
                      <TableCell
                        key={i}
                        align={"center"}
                        className={column.className}
                        sx={{
                          display: {
                            xs: column.className?.includes("hidden") ? "none" : "table-cell",
                            sm: "table-cell",
                          },
                        }}
                      >
                        {column.render
                          ? column.render(row)
                          : column.label === "Acciones"
                          ? (
                            <ButtonsTable
                              el={row}
                              handleDelete={handleDelete}
                              setOpenModal={setOpenModal}
                            />
                          ) : (
                            row[column.key]
                          )
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={sortedRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};