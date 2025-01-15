import React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type Column<T> = {
    header: string;
    accessor: keyof T;
    className?: string;
    render?: (value: T[keyof T], item: T) => React.ReactNode;
}

type TodaiTableProps<T> = {
    data: T[];
    columns: Column<T>[];
    caption?: string;
    footerContent?: React.ReactNode;
}

export function TodaiTable<T>({ data, columns, caption, footerContent }: TodaiTableProps<T>) {
    return (
        <Table>
            {caption && <TableCaption>{caption}</TableCaption>}
            <TableHeader>
                <TableRow>
                    {columns.map((column, index) => (
                        <TableHead key={index} className={column.className}>
                            {column.header}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {columns.map((column, cellIndex) => (
                            <TableCell key={cellIndex} className={column.className}>
                                {column.render
                                    ? column.render(item[column.accessor], item)
                                    : item[column.accessor] as React.ReactNode}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
            {footerContent && (
                <TableFooter>
                    <TableRow>{footerContent}</TableRow>
                </TableFooter>
            )}
        </Table>
    );
}


//! Example usage
// interface Invoice {
//     invoice: string;
//     paymentStatus: string;
//     totalAmount: string;
//     paymentMethod: string;
// }

// const invoices: Invoice[] = [
//     {
//         invoice: "INV001",
//         paymentStatus: "Paid",
//         totalAmount: "$250.00",
//         paymentMethod: "Credit Card",
//     },
//     // ... other invoice data
// ];

// const columns: Column<Invoice>[] = [
//     { header: "Invoice", accessor: "invoice", className: "w-[100px] font-medium" },
//     { header: "Status", accessor: "paymentStatus" },
//     { header: "Method", accessor: "paymentMethod" },
//     { header: "Amount", accessor: "totalAmount", className: "text-right" },
// ];

// export function InvoiceTable() {
//     const totalAmount = "$2,500.00"; // Calculate this based on your data

//     return (
//         <TodaiTable<Invoice>
//             data={invoices}
//             columns={columns}
//             caption="A list of your recent invoices."
//             footerContent={
//                 <>
//                     <TableCell colSpan={3}>Total</TableCell>
//                     <TableCell className="text-right">{totalAmount}</TableCell>
//                 </>
//             }
//         />
//     );
// }