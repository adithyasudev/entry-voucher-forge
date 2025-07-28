import React from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { updateHeader } from '@/store/slices/salesSlice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SalesHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const header = useAppSelector((state) => state.sales.header);

  const handleFieldChange = (field: string, value: string | number) => {
    dispatch(updateHeader({ [field]: value }));
  };

  return (
    <div className="bg-sales-header p-4 border border-sales-table-border">
      <div className="text-center font-bold text-sales-header-foreground mb-4 text-lg">
        Header
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Vr NO */}
        <div className="space-y-2">
          <Label htmlFor="vr_no" className="text-sales-header-foreground font-medium">
            Vr NO:
          </Label>
          <Input
            id="vr_no"
            type="number"
            value={header.vr_no || ''}
            onChange={(e) => handleFieldChange('vr_no', parseInt(e.target.value) || 0)}
            className="bg-white border-sales-table-border"
            placeholder="Vr NO"
          />
        </div>

        {/* Vr Date */}
        <div className="space-y-2">
          <Label htmlFor="vr_date" className="text-sales-header-foreground font-medium">
            Vr Date:
          </Label>
          <Input
            id="vr_date"
            type="date"
            value={header.vr_date}
            onChange={(e) => handleFieldChange('vr_date', e.target.value)}
            className="bg-white border-sales-table-border"
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sales-header-foreground font-medium">
            Status
          </Label>
          <Select
            value={header.status}
            onValueChange={(value: 'A' | 'I') => handleFieldChange('status', value)}
          >
            <SelectTrigger className="bg-white border-sales-table-border">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A - Active</SelectItem>
              <SelectItem value="I">I - Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons Placeholder */}
        <div className="space-y-2">
          <div className="h-6"></div> {/* Spacer for alignment */}
          {/* <div className="flex flex-col gap-1">
            <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 text-sm rounded border border-sales-table-border">
              New
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 text-sm rounded border border-sales-table-border">
              Insert
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 text-sm rounded border border-sales-table-border">
              Save
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 text-sm rounded border border-sales-table-border">
              Print
            </button>
            
          </div> */}
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* AC Name */}
        <div className="space-y-2">
          <Label htmlFor="ac_name" className="text-sales-header-foreground font-medium">
            AC Name:
          </Label>
          <Input
            id="ac_name"
            type="text"
            value={header.ac_name}
            onChange={(e) => handleFieldChange('ac_name', e.target.value)}
            className="bg-white border-sales-table-border"
            placeholder="Account Name"
          />
        </div>

        {/* AC Amt */}
        <div className="space-y-2">
          <Label htmlFor="ac_amt" className="text-sales-header-foreground font-medium">
            AC Amt
          </Label>
          <Input
            id="ac_amt"
            type="number"
            value={header.ac_amt.toFixed(2)}
            readOnly
            className="bg-gray-100 border-sales-table-border text-right font-bold"
            step="0.01"
          />
        </div>
      </div>
    </div>
  );
};

export default SalesHeader;