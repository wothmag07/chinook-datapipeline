with il as (
    select invoice_line_id, invoice_id, track_id, quantity, line_total
    from {{ ref('stg_invoice_line') }}
),
inv as (
    select invoice_id, invoice_date, customer_id
    from {{ ref('stg_invoice') }}
),
tracks as (
    select track_id, track_name, album_id, media_type_id, genre_id, list_price
    from {{ ref('stg_track') }}
),
aggregated as (
    select
        il.track_id,
        tr.track_name,
        tr.album_id,
        tr.media_type_id,
        tr.genre_id,
        sum(il.quantity) as units_sold,
        sum(il.line_total) as revenue,
        min(inv.invoice_date) as first_sold_date,
        max(inv.invoice_date) as last_sold_date,
        count(distinct inv.invoice_id) as order_count
    from il
    join inv on il.invoice_id = inv.invoice_id
    join tracks tr on il.track_id = tr.track_id
    group by il.track_id, tr.track_name, tr.album_id, tr.media_type_id, tr.genre_id
)
select * from aggregated
