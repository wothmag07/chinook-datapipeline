cube(`DimDate`, {
  sql: `SELECT * FROM chinook_db_marts.dim_date`,
  
  preAggregations: {
    // Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started  
  },
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`,
      description: "Count of days (use with care, usually not a primary business measure).",
      drillMembers: [date, dateIso, yearMonth]
    }
  },
  
  dimensions: {
    date: {
      sql: `date`,
      type: `time`,
      primaryKey: true,
      title: "Date"
    },
    dateIso: {
      sql: `date_iso`,
      type: `string`,
      title: "Date (ISO)"
    },
    year: {
      sql: `year`,
      type: `number`,
      title: "Year"
    },
    month: {
      sql: `month`,
      type: `number`,
      title: "Month"
    },
    day: {
      sql: `day`,
      type: `number`,
      title: "Day"
    },
    yearMonth: {
      sql: `year_month`,
      type: `string`,
      title: "Year-Month"
    },
    quarter: {
      sql: `quarter`,
      type: `number`,
      title: "Quarter"
    },
    isoWeek: {
      sql: `iso_week`,
      type: `number`,
      title: "ISO Week"
    },
    isWeekend: {
      sql: `is_weekend`,
      type: `boolean`,
      title: "Is Weekend?"
    }
  },
  
  dataSource: `default`
});
