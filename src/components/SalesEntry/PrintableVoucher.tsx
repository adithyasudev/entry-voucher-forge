import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Printer } from 'lucide-react';
import { HeaderData, DetailItem } from '@/store/slices/salesSlice';

interface PrintableVoucherProps {
  onClose: () => void;
  header: HeaderData;
  details: DetailItem[];
}

const PrintableVoucher: React.FC<PrintableVoucherProps> = ({ onClose, header, details }) => {
  const handlePrint = () => {
    window.print();
  };

  const calculateTotal = () => {
    return details.reduce((sum, detail) => sum + detail.amount, 0);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Print controls - hidden during print */}
      <div className="print:hidden bg-gray-100 p-4 border-b">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h2 className="text-xl font-bold">Sales Voucher - Print Preview</h2>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button onClick={onClose} variant="outline" className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Printable content */}
      <div className="max-w-4xl mx-auto p-8 print:p-4">
        {/* Company Header */}
        <div className="text-center mb-8 print:mb-4">
          <h1 className="text-3xl font-bold print:text-2xl">Your Company Name</h1>
          <p className="text-gray-600 print:text-black">Sales Voucher</p>
        </div>

        {/* Voucher Header */}
        <div className="border border-black mb-6 print:mb-4">
          <div className="bg-yellow-200 p-3 print:bg-gray-100">
            <h2 className="text-center font-bold text-lg print:text-base">Header</h2>
          </div>
          
          <div className="p-4 print:p-2">
            <div className="grid grid-cols-2 gap-4 print:gap-2 mb-4">
              <div className="flex">
                <span className="font-medium w-24">Vr NO:</span>
                <span className="border-b border-black flex-1 px-2">{header.vr_no}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">Vr Date:</span>
                <span className="border-b border-black flex-1 px-2">{header.vr_date}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 print:gap-2 mb-4">
              <div className="flex">
                <span className="font-medium w-24">Status:</span>
                <span className="border-b border-black flex-1 px-2">{header.status === 'A' ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">AC Amt:</span>
                <span className="border-b border-black flex-1 px-2 text-right font-bold">{header.ac_amt.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex">
              <span className="font-medium w-24">AC Name:</span>
              <span className="border-b border-black flex-1 px-2">{header.ac_name}</span>
            </div>
          </div>
        </div>

        {/* Voucher Details */}
        <div className="border border-black">
          <div className="bg-yellow-100 p-3 print:bg-gray-50">
            <h2 className="text-center font-bold text-lg print:text-base">Detail</h2>
          </div>
          
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 print:bg-gray-50">
                <th className="border border-black p-2 print:p-1 text-left text-sm">Sr NO</th>
                <th className="border border-black p-2 print:p-1 text-left text-sm">Item Code</th>
                <th className="border border-black p-2 print:p-1 text-left text-sm">Item Name</th>
                <th className="border border-black p-2 print:p-1 text-left text-sm">Description</th>
                <th className="border border-black p-2 print:p-1 text-right text-sm">Qty</th>
                <th className="border border-black p-2 print:p-1 text-right text-sm">Rate</th>
                <th className="border border-black p-2 print:p-1 text-right text-sm">Amount</th>
              </tr>
            </thead>
            <tbody>
              {details.map((detail, index) => (
                <tr key={index}>
                  <td className="border border-black p-2 print:p-1 text-sm">{detail.sr_no}</td>
                  <td className="border border-black p-2 print:p-1 text-sm">{detail.item_code}</td>
                  <td className="border border-black p-2 print:p-1 text-sm">{detail.item_name}</td>
                  <td className="border border-black p-2 print:p-1 text-sm">{detail.description}</td>
                  <td className="border border-black p-2 print:p-1 text-right text-sm">{detail.qty.toFixed(3)}</td>
                  <td className="border border-black p-2 print:p-1 text-right text-sm">{detail.rate.toFixed(2)}</td>
                  <td className="border border-black p-2 print:p-1 text-right text-sm">{detail.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 print:bg-gray-50 font-bold">
                <td colSpan={6} className="border border-black p-2 print:p-1 text-right text-sm">
                  Total:-
                </td>
                <td className="border border-black p-2 print:p-1 text-right text-sm">
                  {calculateTotal().toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-8 print:mt-4 text-center text-sm text-gray-600 print:text-black">
          <p>Generated on: {new Date().toLocaleString()}</p>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            margin: 1cm;
            size: A4;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintableVoucher;