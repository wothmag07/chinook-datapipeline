with il as (
    select
        invoice_line_id,
        invoice_id,
        track_id,
        quantity,
        sale_price,
        line_total
    from {{ ref('stg_invoice_line') }}
),
inv as (
    select
        invoice_id,
        customer_id,
        invoice_date
    from {{ ref('stg_invoice') }}
),
tracks as (
    select
        track_id,
        album_id,
        genre_id,
        media_type_id
    from {{ ref('stg_track') }}
),
customers as (
    select
        customer_id,
        support_rep_id as employee_id
    from {{ ref('stg_customer') }}
),
final as (
    select
        {{ dbt_utils.generate_surrogate_key(['il.invoice_line_id']) }} as sale_key,
        il.invoice_line_id,
        il.invoice_id,
        il.track_id,
        tr.album_id,
        tr.genre_id,
        tr.media_type_id,
        inv.customer_id,
        cust.employee_id,
        inv.invoice_date,
        il.quantity,
        il.sale_price,
        il.line_total as revenue
    from il
    join inv on il.invoice_id = inv.invoice_id
    left join tracks tr on il.track_id = tr.track_id
    left join customers cust on inv.customer_id = cust.customer_id
)
select * from final
