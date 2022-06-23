import React, { useEffect } from "react";
import { usePagination, useTable } from "react-table";
import Loading from "../Loading/Loading";

const Table = ({ columns, paginate, fetchData, loading, refreshRef }) => {
  const tableInstance = useTable(
    {
      columns,
      data: paginate.data,
      initialState: {
        pageIndex: 0,
        pageSize: paginate.page_size,
      },
      manualPagination: true,
      pageCount: paginate.total_pages,
    },
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  useEffect(() => {
    fetchData({ pageIndex, pageSize });

    if (refreshRef) {
      refreshRef.current.onclick = () => {
        fetchData({ pageIndex, pageSize });
      };
    }

    return () => {};
  }, [fetchData, pageIndex, pageSize, refreshRef]);

  return (
    <div>
      <div className="custom-table h-144 block overflow-y-scroll border bg-slate-50 border-slate-700">
        <table
          {...getTableProps()}
          className=" table-spacing table-auto w-full text-sm"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="text-left">
                {headerGroup.headers.map((column) => {
                  return (
                    <th
                      {...column.getHeaderProps()}
                      className="sticky bg-slate-700 text-white top-0 py-1.5 pl-3"
                    >
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {loading ? (
              <tr>
                <td colSpan={10000}>
                  <Loading />
                </td>
              </tr>
            ) : (
              <>
                {page.length < 1 ? (
                  <tr>
                    <td colSpan={10000}>
                      <div className="flex py-2 text-gray-500 justify-center">
                        No Entries Found
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {page.map((row) => {
                      prepareRow(row);
                      return (
                        <tr
                          {...row.getRowProps()}
                          className="rounded-tl-sm rounded-bl-sm rounded-tr-sm even:bg-slate-200 odd:bg-slate-50 rounded-br-sm"
                        >
                          {row.cells.map((cell) => {
                            return (
                              <td
                                {...cell.getCellProps({
                                  style: {
                                    minWidth: cell.column.minWidth,
                                    width: cell.column.width,
                                  },
                                })}
                                className="border-t border-b border-gray-200 px-3 spr-2 py-2"
                              >
                                {cell.render("Cell")}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between px-2 bg-slate-50 py-1">
        {loading ? (
          <span>Loading...</span>
        ) : (
          <>
            <span>{paginate.total_count || 0} results</span>
            <span>
              {pageSize * pageIndex + 1} -{pageSize * pageIndex + page.length}
            </span>
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {"<<"}
            </button>
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              prev
            </button>
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              next
            </button>
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </button>
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length || 1}
              </strong>{" "}
            </span>
            <span>
              Go to page:{" "}
              <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 1;
                  gotoPage(page);
                }}
                style={{ width: "100px" }}
              />
            </span>{" "}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[20, 30, 40, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
    </div>
  );
};

export default Table;
