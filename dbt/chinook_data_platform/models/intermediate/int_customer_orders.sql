with inv as (
    select * from {{ ref('stg_invoice') }}
),
il as (
    select * from {{ ref('stg_invoice_line') }}
),
aggregated as (
    select
        inv.customer_id,
        sum(il.sale_price * il.quantity) as customer_lifetime_value,
        count(distinct inv.invoice_id) as order_count
    from inv
    join il on inv.invoice_id = il.invoice_id
    group by 1
)
select * from aggregated