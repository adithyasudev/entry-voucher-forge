import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { updateDetail, addDetailRow, removeDetailRow, fetchItemMaster, type DetailItem } from '@/store/slices/salesSlice';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

const SalesDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const { details, itemMaster, loading } = useAppSelector((state) => state.sales);

  useEffect(() => {
    dispatch(fetchItemMaster());
  }, [dispatch]);

  const handleFieldChange = <T extends keyof DetailItem>(
  index: number,
  field: T,
  value: DetailItem[T]
) => {
  dispatch(updateDetail({ index, field, value }));
};

  const handleAddRow = () => {
    dispatch(addDetailRow());
  };

  const handleRemoveRow = (index: number) => {
    dispatch(removeDetailRow(index));
  };

  const calculateTotal = () => {
    return details.reduce((sum, detail) => sum + detail.amount, 0);
  };

  return (
    <div className="bg-sales-detail p-4 border border-sales-table-border">
      <div className="text-center font-bold text-sales-detail-foreground mb-4 text-lg">
        Detail
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-sales-table-border p-2 text-left text-sales-detail-foreground">Sr NO</th>
              <th className="border border-sales-table-border p-2 text-left text-sales-detail-foreground">Item Code</th>
              <th className="border border-sales-table-border p-2 text-left text-sales-detail-foreground">Item Name</th>
              <th className="border border-sales-table-border p-2 text-left text-sales-detail-foreground">Description</th>
              <th className="border border-sales-table-border p-2 text-left text-sales-detail-foreground">Qty</th>
              <th className="border border-sales-table-border p-2 text-left text-sales-detail-foreground">Rate</th>
              <th className="border border-sales-table-border p-2 text-left text-sales-detail-foreground">Amount</th>
              <th className="border border-sales-table-border p-2 text-left text-sales-detail-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {details.map((detail, index) => (
              <tr key={index} className="hover:bg-white/50">
                <td className="border border-sales-table-border p-2">
                  <Input
                    type="number"
                    value={detail.sr_no}
                    readOnly
                    className="w-16 bg-gray-50 text-center"
                  />
                </td>
                <td className="border border-sales-table-border p-2">
                  <Select
                    value={detail.item_code}
                    onValueChange={(value) => handleFieldChange(index, 'item_code', value)}
                  >
                    <SelectTrigger className="w-32 bg-white">
                      <SelectValue placeholder="Select Item" />
                    </SelectTrigger>
                    <SelectContent>
                      {itemMaster.map((item) => (
                        <SelectItem key={item.item_code} value={item.item_code}>
                          {item.item_code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="border border-sales-table-border p-2">
                  <Input
                    value={detail.item_name}
                    readOnly
                    className="w-40 bg-gray-50"
                    placeholder="Item Name"
                  />
                </td>
                <td className="border border-sales-table-border p-2">
                  <Textarea
                    value={detail.description}
                    onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                    className="w-60 bg-white min-h-[60px] resize-none"
                    placeholder="Description"
                  />
                </td>
                <td className="border border-sales-table-border p-2">
                  <Input
                    type="number"
                    value={detail.qty || ''}
                    onChange={(e) => handleFieldChange(index, 'qty', parseFloat(e.target.value) || 0)}
                    className="w-20 bg-white text-right"
                    step="0.001"
                    placeholder="Qty"
                  />
                </td>
                <td className="border border-sales-table-border p-2">
                  <Input
                    type="number"
                    value={detail.rate || ''}
                    onChange={(e) => handleFieldChange(index, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-24 bg-white text-right"
                    step="0.01"
                    placeholder="Rate"
                  />
                </td>
                <td className="border border-sales-table-border p-2">
                  <Input
                    type="number"
                    value={detail.amount.toFixed(2)}
                    readOnly
                    className="w-24 bg-gray-50 text-right font-medium"
                    step="0.01"
                  />
                </td>
                <td className="border border-sales-table-border p-2">
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddRow}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    {details.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveRow(index)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td colSpan={6} className="border border-sales-table-border p-2 text-right text-sales-detail-foreground">
                Total:-
              </td>
              <td className="border border-sales-table-border p-2 text-right text-sales-detail-foreground">
                {calculateTotal().toFixed(2)}
              </td>
              <td className="border border-sales-table-border p-2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default SalesDetail;