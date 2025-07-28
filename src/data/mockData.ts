export const mockItemMaster = [
  { item_code: "ITEM001", item_name: "Laptop Computer" },
  { item_code: "ITEM002", item_name: "Wireless Mouse" },
  { item_code: "ITEM100", item_name: "Office Chair" },
  { item_code: "ITEM145", item_name: "Monitor 24 inch" },
  { item_code: "ITEM170", item_name: "Keyboard Mechanical" },
  { item_code: "ITEM200", item_name: "Desk Lamp LED" },
  { item_code: "ITEM250", item_name: "USB Cable Type-C" },
  { item_code: "ITEM300", item_name: "Notebook A4" },
];

export const mockSalesData = {
  header: {
    vr_no: 1001,
    vr_date: "2024-01-15",
    ac_name: "ABC Corporation Ltd.",
    ac_amt: 0, // Will be calculated
    status: "A" as const,
  },
  details: [
    {
      sr_no: 1,
      item_code: "ITEM001",
      item_name: "Laptop Computer",
      description: "High performance laptop for office work with 16GB RAM and 512GB SSD",
      qty: 2,
      rate: 1200.00,
      amount: 2400.00,
    },
    {
      sr_no: 2,
      item_code: "ITEM002",
      item_name: "Wireless Mouse",
      description: "Ergonomic wireless mouse with USB receiver",
      qty: 5,
      rate: 25.00,
      amount: 125.00,
    },
    {
      sr_no: 3,
      item_code: "ITEM100",
      item_name: "Office Chair",
      description: "Comfortable office chair with lumbar support and adjustable height",
      qty: 3,
      rate: 350.00,
      amount: 1050.00,
    },
  ],
};