import React from 'react';

export const TableCard = ({ title, subtitle, headers, data, onRowClick }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index} className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                onClick={() => onRowClick && onRowClick(row)}
                                className={`border-b border-gray-50 ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                            >
                                {headers.map((header, colIndex) => (
                                    <td key={colIndex} className="py-4 px-6 text-sm text-gray-700">
                                        {row[header]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableCard;
