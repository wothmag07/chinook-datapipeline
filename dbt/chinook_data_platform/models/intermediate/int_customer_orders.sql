with inv as (
    select invoice_id, customer_id, invoice_date
    from {{ ref('stg_invoice') }}
),
il as (
    select invoice_id, line_total
    from {{ ref('stg_invoice_line') }}
),
aggregated as (
    select
        inv.customer_id,
        sum(il.line_total) as customer_lifetime_value,
        count(distinct inv.invoice_id) as order_count,
        min(inv.invoice_date) as first_order_date,
        max(inv.invoice_date) as last_order_date
    from inv
    join il on inv.invoice_id = il.invoice_id
    group by inv.customer_id
)
select * from aggregated
