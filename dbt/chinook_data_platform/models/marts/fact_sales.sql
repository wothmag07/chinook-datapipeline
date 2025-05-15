with il as (
    select * from {{ ref('stg_invoice_line') }}
),
inv as (
    select * from {{ ref('stg_invoice') }}
),
final as (
    select
        il.invoice_line_id,
        il.invoice_id,
        il.track_id,
        il.quantity,
        il.sale_price,
        il.sale_price * il.quantity as revenue,
        inv.customer_id,
        inv.invoice_date
    from il
    join inv on il.invoice_id = inv.invoice_id
)
select * from final