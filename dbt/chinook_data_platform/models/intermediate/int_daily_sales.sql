with inv as (
    select invoice_id, invoice_date
    from {{ ref('stg_invoice') }}
),
il as (
    select invoice_id, sale_price, quantity
    from {{ ref('stg_invoice_line') }}
),
agg as (
    select
        cast(invoice_date as date)          as sales_date,
        sum(sale_price*quantity)            as revenue,
        count(*)                            as lines,
        count(distinct invoice_id)          as invoices
    from inv
    join il using (invoice_id)
    group by 1
)
select * from agg