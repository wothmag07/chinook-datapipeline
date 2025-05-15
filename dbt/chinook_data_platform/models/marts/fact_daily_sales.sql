with int_daily_sales as (
    select * from {{ ref('int_daily_sales') }}
)

select 
    sales_date,
    revenue,
    lines,
    invoices
from int_daily_sales 