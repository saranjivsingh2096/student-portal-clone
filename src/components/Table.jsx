const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  isTotalRow = false,
}) => {
  return (
    <div className="table-responsive table-billing-history">
      <table className="table mb-0">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} width={column.width} scope="col">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="text-center">
                Loading data...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={index}>
                {columns.map((column, i) => (
                  <td key={i}>{row[column.key] || 0}</td>
                ))}
              </tr>
            ))
          )}

          {isTotalRow && (
            <tr className="text-white bg-custom font-weight-bold font-weight-700">
              <td className="text-right" colSpan={columns.length - 6}>
                Total
              </td>
              {columns.slice(-6).map((col, i) => (
                <td key={i}>{col.totalValue || 0}</td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
