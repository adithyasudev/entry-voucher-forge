import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface DetailItem {
  sr_no: number;
  item_code: string;
  item_name: string;
  description: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface HeaderData {
  vr_no: number;
  vr_date: string;
  ac_name: string;
  ac_amt: number;
  status: 'A' | 'I';
}

export interface ItemMaster {
  item_code: string;
  item_name: string;
}

interface SalesState {
  header: HeaderData;
  details: DetailItem[];
  itemMaster: ItemMaster[];
  loading: boolean;
  error: string | null;
  lastSavedData: null;
}

const initialState: SalesState = {
  header: {
    vr_no: 0,
    vr_date: new Date().toISOString().split('T')[0],
    ac_name: '',
    ac_amt: 0,
    status: 'A',
  },
  details: [{
    sr_no: 1,
    item_code: '',
    item_name: '',
    description: '',
    qty: 0,
    rate: 0,
    amount: 0,
  }],
  itemMaster: [],
  loading: false,
  error: null,
  lastSavedData: null,
};

// Async thunks for API calls
export const fetchItemMaster = createAsyncThunk(
  'sales/fetchItemMaster',
  async () => {
    const response = await fetch('http://5.189.180.8:8010/item');
    if (!response.ok) {
      throw new Error('Failed to fetch item master');
    }
    return response.json();
  }
);

export const saveSalesData = createAsyncThunk(
  'sales/saveSalesData',
  async (data: { header_table: HeaderData; detail_table: DetailItem[] }) => {
    const response = await fetch('http://5.189.180.8:8010/header/multiple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to save sales data');
    }
    return response.json();
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    updateHeader: (state, action: PayloadAction<Partial<HeaderData>>) => {
      state.header = { ...state.header, ...action.payload };
    },
    
    updateDetail: (
      state,
      action: PayloadAction<{
        index: number;
        field: keyof DetailItem;
        value: DetailItem[keyof DetailItem];
      }>
    ) => {
      const { index, field, value } = action.payload;
      if (state.details[index]) {
        state.details[index][field] = value as never;

        if (field === 'qty' || field === 'rate') {
          state.details[index].amount = state.details[index].qty * state.details[index].rate;
        }

        if (field === 'item_code') {
          const item = state.itemMaster.find((item) => item.item_code === value);
          if (item) {
            state.details[index].item_name = item.item_name;
          }
        }

        state.header.ac_amt = state.details.reduce((sum, detail) => sum + detail.amount, 0);
      }
    },

    addDetailRow: (state) => {
      const newSrNo = state.details.length + 1;
      state.details.push({
        sr_no: newSrNo,
        item_code: '',
        item_name: '',
        description: '',
        qty: 0,
        rate: 0,
        amount: 0,
      });
    },

    removeDetailRow: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (state.details.length > 1) {
        state.details.splice(index, 1);
        state.details.forEach((detail, idx) => {
          detail.sr_no = idx + 1;
        });
        state.header.ac_amt = state.details.reduce((sum, detail) => sum + detail.amount, 0);
      }
    },

    resetForm: (state) => {
      state.header = {
        vr_no: 0,
        vr_date: new Date().toISOString().split('T')[0],
        ac_name: '',
        ac_amt: 0,
        status: 'A',
      };
      state.details = [{
        sr_no: 1,
        item_code: '',
        item_name: '',
        description: '',
        qty: 0,
        rate: 0,
        amount: 0,
      }];
      state.error = null;
    },

    loadMockData: (state, action: PayloadAction<{ header: HeaderData; details: DetailItem[] }>) => {
      state.header = action.payload.header;
      state.details = action.payload.details;
      state.header.ac_amt = state.details.reduce((sum, detail) => sum + detail.amount, 0);
    },

    setMockItemMaster: (state, action: PayloadAction<ItemMaster[]>) => {
      state.itemMaster = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchItemMaster.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItemMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.itemMaster = action.payload;
      })
      .addCase(fetchItemMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch item master';
      })
      .addCase(saveSalesData.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveSalesData.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSavedData = action.payload;
        state.error = null;
      })
      .addCase(saveSalesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save sales data';
      });
  },
});


export const {
  updateHeader,
  updateDetail,
  addDetailRow,
  removeDetailRow,
  resetForm,
  loadMockData,
  setMockItemMaster,
} = salesSlice.actions;


export default salesSlice.reducer;