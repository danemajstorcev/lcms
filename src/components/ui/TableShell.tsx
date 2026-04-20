import { type ReactNode } from 'react';

interface TableShellProps {
  headers:  string[];
  children: ReactNode;
}

export default function TableShell({ headers, children }: TableShellProps) {
  return (
    <div className="table-wrap">
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}
