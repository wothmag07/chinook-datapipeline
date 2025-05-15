cube(`FactSales`, {
  sql: `SELECT * FROM chinook_db_marts.fact_sales`,
  
  preAggregations: {
    // Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started  
  },
  
  measures: {
    count: {
      type: `count`,
      description: "Total number of sales line items."
    },
    totalRevenue: {
      sql: `revenue`,
      type: `sum`,
      format: `currency`,
      description: "Total revenue from all sales."
    },
    totalQuantity: {
      sql: `quantity`,
      type: `sum`,
      description: "Total number of units sold."
    },
    averageSalePrice: {
      sql: `sale_price`,
      type: `avg`,
      format: `currency`,
      description: "Average sale price per line item."
    },
    averageRevenuePerItem: {
      description: "Average revenue per unit sold (revenue / quantity).",
      sql: `${totalRevenue} / NULLIF(${totalQuantity}, 0)`,
      type: `number`,
      format: `currency`
    },
    distinctInvoices: {
      sql: `invoice_id`,
      type: `countDistinct`,
      description: "Number of unique invoices."
    },
    distinctTracksSold: {
      sql: `track_id`,
      type: `countDistinct`,
      description: "Number of unique tracks sold."
    },
    distinctCustomers: {
      sql: `customer_id`,
      type: `countDistinct`,
      description: "Number of unique customers making purchases."
    }
  },

  dimensions: {
    invoiceLineId: {
      sql: `invoice_line_id`,
      type: `number`
    },
    invoiceId: {
      sql: `invoice_id`,
      type: `number`
    },
    trackId: {
      sql: `track_id`,
      type: `number`
    },
    customerId: {
      sql: `customer_id`,
      type: `number`
    },
    invoiceDate: {
      sql: `invoice_date`,
      type: `time`
    }
  },

  joins: {
    Tracks: {
      sql: `${CUBE}.track_id = ${DimTracks}.track_id`,
      relationship: `belongsTo`
    },
    Customers: {
      sql: `${CUBE}.customer_id = ${DimCustomers}.customer_id`,
      relationship: `belongsTo`
    },
    DateDimensions: {
      // Assuming invoice_date in fact_sales is a timestamp and date in dim_date is a date.
      // Adjust the SQL for the join condition if the data types or formats require it.
      sql: `CAST(${CUBE}.invoice_date AS DATE) = ${DateDimensions}.date`,
      relationship: `belongsTo`
    }
  },
  
  dataSource: `default`
});
