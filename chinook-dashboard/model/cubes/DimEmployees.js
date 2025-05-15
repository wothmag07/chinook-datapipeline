cube(`DimEmployees`, {
  sql: `SELECT * FROM chinook_db_marts.dim_employees`,
  
  preAggregations: {
    // Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started  
  },
  joins: {
    Manager: {
      relationship: `belongsTo`,
      sql: `${CUBE}.reports_to = ${Manager}.employee_id`
    }
  },
  
  measures: {
    count: {
      type: `count`,
      description: "Total number of employees.",
      drillMembers: [firstName, lastName, title, city, country, birthDate, hireDate]
    },
    summedRevenueByGroup: {
      title: "Summed Revenue (Group)",
      description: "Sum of revenue attributed to the selected group of employees.",
      sql: `revenue`,
      type: `sum`,
      format: `currency`
    },
    summedInvoicesHandledByGroup: {
      title: "Summed Invoices Handled (Group)",
      description: "Sum of invoices handled by the selected group of employees.",
      sql: `invoices_handled`,
      type: `sum`
    },
    summedLinesHandledByGroup: {
      title: "Summed Lines Handled (Group)",
      description: "Sum of lines handled by the selected group of employees.",
      sql: `lines_handled`,
      type: `sum`
    },
    avgOfEmployeeARPI: {
      title: "Avg of Employee ARPI's",
      description: "Average of individual employee average revenue per invoice.",
      sql: `avg_revenue_per_invoice`,
      type: `avg`,
      format: `currency`
    },
    groupAverageRevenuePerInvoice: {
      title: "Group Avg Revenue Per Invoice",
      description: "Overall average revenue per invoice for the selected group of employees.",
      sql: `${CUBE.summedRevenueByGroup} / NULLIF(${CUBE.summedInvoicesHandledByGroup}, 0)`,
      type: `number`,
      format: `currency`
    }
  },

  dimensions: {
    employeeId: {
      sql: `employee_id`,
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
    title: {
      sql: `title`,
      type: `string`
    },
    reportsToEmployeeId: {
      sql: `reports_to`,
      type: `number`
    },
    birthDate: {
      sql: `birth_date`,
      type: `time`
    },
    age: {
      sql: `age`,
      type: `number`
    },
    hireDate: {
      sql: `hire_date`,
      type: `time`
    },
    experienceYears: {
      sql: `experience_years`,
      type: `number`
    },
    address: {
      sql: `address`,
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
    country: {
      sql: `country`,
      type: `string`
    },
    postalCode: {
      sql: `postal_code`,
      type: `string`
    },
    phone: {
      sql: `phone`,
      type: `string`
    },
    fax: {
      sql: `fax`,
      type: `string`
    },
    email: {
      sql: `email`,
      type: `string`
    }
  }
  
}); 