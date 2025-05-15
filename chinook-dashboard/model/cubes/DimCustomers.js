cube(`DimCustomers`, {
  sql: `SELECT * FROM chinook_db_marts.dim_customers`,
  
  preAggregations: {
    // Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started  
  },
  measures: {
    count: {
      type: `count`,
      description: "Total number of customers.",
      drillMembers: [customerId, firstName, lastName, company]
    },
    summedLifetimeValue: {
      title: "Summed LTV (Group)",
      description: "Sum of lifetime values for the selected group of customers.",
      sql: `customer_lifetime_value`,
      type: `sum`,
      format: `currency`
    },
    summedOrderCount: {
      title: "Summed Order Count (Group)",
      description: "Sum of order counts for the selected group of customers.",
      sql: `order_count`,
      type: `sum`
    },
    avgCustomerLifetimeValue: {
      title: "Avg LTV per Customer",
      description: "Average lifetime value of customers in the group.",
      sql: `customer_lifetime_value`,
      type: `avg`,
      format: `currency`
    },
    avgCustomerOrderCount: {
      title: "Avg Orders per Customer",
      description: "Average number of orders per customer in the group.",
      sql: `order_count`,
      type: `avg`
    },
    avgOfCustomerAOV: { // Renaming for clarity from original averageOrderValue
      title: "Avg of Customer AOV's",
      description: "Average of individual customer's average order values.",
      sql: `avg_order_value`,
      type: `avg`,
      format: `currency`
    },
    groupAverageOrderValue: {
      title: "Group Avg Order Value",
      description: "Overall average order value for the selected group (Summed LTV / Summed Orders).",
      sql: `${CUBE.summedLifetimeValue} / NULLIF(${CUBE.summedOrderCount}, 0)`,
      type: `number`,
      format: `currency`
    }
  },

  dimensions: {
    customerId: {
      sql: `customer_id`,
      type: `number`,
      primaryKey: true
    },
    firstName: {
      sql: `first_name`,
      type: `string`
    },
    lastName: {
      sql: `last_name`,
      type: `string`
    },
    fullName: {
      sql: `CONCAT(${CUBE}.first_name, ' ', ${CUBE}.last_name)`,
      type: `string`
    },
    company: {
      sql: `company`,
      type: `string`
    },
    country: {
      sql: `country`,
      type: `string`
    },
    city: {
      sql: `city`,
      type: `string`
    },
    state: {
      sql: `state`,
      type: `string`
    },
    postalCode: {
      sql: `postal_code`,
      type: `string`
    },
    email: {
      sql: `email`,
      type: `string`
    },
    phone: {
      sql: `phone`,
      type: `string`
    },
    supportRepId: {
      sql: `support_rep_id`,
      type: `number`
    },
    repFirstName: {
      // Denormalized: from dim_customers. To get from Employees cube, use join.
      sql: `rep_first_name`,
      type: `string`
    },
    repLastName: {
      sql: `rep_last_name`,
      type: `string`
    },
    repFullName: {
      sql: `CONCAT(${CUBE}.rep_first_name, ' ', ${CUBE}.rep_last_name)`,
      type: `string`
    },
    repTitle: {
      sql: `rep_title`,
      type: `string`
    }
  },
  joins: {
    DimEmployees: {
      sql: `${CUBE}.support_rep_id = ${DimEmployees}.employee_id`,
      relationship: `belongsTo` // Each customer has one support rep
    }
  }
  
  });
