import React, { createContext, useContext, useState } from 'react';

const TableDataContext = createContext();

export function TableDataProvider({ children }) {
  const [tableData, setTableData] = useState([]);

  return (
    <TableDataContext.Provider value={{ tableData, setTableData }}>
      {children}
    </TableDataContext.Provider>
  );
}

export function useTableData() {
  return useContext(TableDataContext);
}