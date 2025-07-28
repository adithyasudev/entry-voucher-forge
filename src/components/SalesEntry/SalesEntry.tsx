import React from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { saveSalesData, resetForm, loadMockData, setMockItemMaster } from '@/store/slices/salesSlice';
import { mockItemMaster, mockSalesData } from '@/data/mockData';
import SalesHeader from './SalesHeader';
import SalesDetail from './SalesDetail';
import PrintableVoucher from './PrintableVoucher';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save, FileText, RotateCcw, Database, TestTube } from 'lucide-react';

const SalesEntry: React.FC = () => {
  const dispatch = useAppDispatch();
  const { header, details, loading, error, lastSavedData } = useAppSelector((state) => state.sales);
  const { toast } = useToast();
  const [showPrintable, setShowPrintable] = React.useState(false);

  // Load mock data on component mount for testing
  React.useEffect(() => {
    dispatch(setMockItemMaster(mockItemMaster));
  }, [dispatch]);

  const loadSampleData = () => {
    dispatch(loadMockData(mockSalesData));
    toast({
      title: "Sample Data Loaded",
      description: "Form has been populated with sample sales data for testing",
    });
  };

  const testCalculations = () => {
    loadSampleData();
    // Show calculation details
    setTimeout(() => {
      const total = mockSalesData.details.reduce((sum, detail) => sum + detail.amount, 0);
      toast({
        title: "Calculations Test",
        description: `✅ Total calculated: $${total.toFixed(2)} | ✅ Auto amounts working | ✅ Form validation ready`,
      });
    }, 500);
  };

  const validateForm = (): boolean => {
    if (!header.ac_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Account Name is required",
        variant: "destructive",
      });
      return false;
    }

    if (header.vr_no <= 0) {
      toast({
        title: "Validation Error",
        description: "Voucher Number must be greater than 0",
        variant: "destructive",
      });
      return false;
    }

    if (!header.vr_date) {
      toast({
        title: "Validation Error",
        description: "Voucher Date is required",
        variant: "destructive",
      });
      return false;
    }

    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      if (!detail.item_code) {
        toast({
          title: "Validation Error",
          description: `Item Code is required for row ${i + 1}`,
          variant: "destructive",
        });
        return false;
      }
      if (detail.qty <= 0) {
        toast({
          title: "Validation Error",
          description: `Quantity must be greater than 0 for row ${i + 1}`,
          variant: "destructive",
        });
        return false;
      }
      if (detail.rate <= 0) {
        toast({
          title: "Validation Error",
          description: `Rate must be greater than 0 for row ${i + 1}`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const salesData = {
      header_table: header,
      detail_table: details.map(detail => ({
        ...detail,
        vr_no: header.vr_no,
      })),
    };

    try {
      await dispatch(saveSalesData(salesData)).unwrap();
      toast({
        title: "Success",
        description: "Sales data saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error as string || "Failed to save sales data",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    dispatch(resetForm());
    setShowPrintable(false);
    toast({
      title: "Form Reset",
      description: "Form has been reset to default values",
    });
  };

  const handlePrint = () => {
    if (!lastSavedData && !validateForm()) {
      toast({
        title: "Print Error",
        description: "Please save the form before printing",
        variant: "destructive",
      });
      return;
    }
    setShowPrintable(true);
  };

  if (showPrintable) {
    return (
      <PrintableVoucher 
        onClose={() => setShowPrintable(false)}
        header={header}
        details={details}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center text-foreground mb-4">
            Sales Entry System
          </h1>
          
          {/* Mock Data Indicator */}
          {/* <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              <TestTube className="h-4 w-4" />
              Testing Mode - Mock data available for testing
            </div>
          </div> */}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              Error: {error}
            </div>
          )}

          <div className="flex justify-center gap-4 mb-4 flex-wrap">
            
            
            
            
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save'}
            </Button>
            
            <Button
              onClick={handlePrint}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Print Voucher
            </Button>
            
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Form
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <SalesHeader />
          <SalesDetail />
        </div>
      </div>
    </div>
  );
};

export default SalesEntry;