with inv as (
    select
        invoice_id,
        customer_id,
        invoice_date
    from {{ ref('stg_invoice') }}
),
il as (
    select
        invoice_id,
        line_total
    from {{ ref('stg_invoice_line') }}
),
final as (
    select
        inv.invoice_date as sales_date,
        sum(il.line_total) as revenue,
        count(*) as line_items,
        count(distinct inv.invoice_id) as invoices,
        count(distinct inv.customer_id) as unique_customers,
        case
            when count(distinct inv.invoice_id) = 0 then null
            else round(sum(il.line_total) / count(distinct inv.invoice_id), 2)
        end as avg_order_value
    from inv
    join il on inv.invoice_id = il.invoice_id
    group by inv.invoice_date
)
select * from final
