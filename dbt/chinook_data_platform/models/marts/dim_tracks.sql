with tracks as (
    select * from {{ ref('stg_track') }}
),
album as (
    select album_id, album_title, artist_id
    from {{ ref('stg_album') }}
),
artist as (
    select artist_id, artist_name
    from {{ ref('stg_artist') }}
),
genre as (
    select genre_id, genre_name
    from {{ ref('stg_genre') }}
),
media as (
    select media_type_id, media_type_name
    from {{ ref('stg_media_type') }}
),
sales as (
    select track_id, units_sold, revenue, first_sold_date, last_sold_date
    from {{ ref('int_track_sales') }}
),
final as (
    select
        tr.track_id,
        tr.track_name,
        tr.list_price,
        tr.duration_ms,
        tr.file_size,
        tr.album_id,
        al.album_title,
        ar.artist_id,
        ar.artist_name,
        tr.genre_id,
        g.genre_name,
        tr.media_type_id,
        m.media_type_name,
        coalesce(sales.units_sold,0) as units_sold,
        coalesce(sales.revenue,0) as revenue,
        sales.first_sold_date,
        sales.last_sold_date,
        case when coalesce(sales.units_sold,0) = 0 then null else round(coalesce(sales.revenue,0)/sales.units_sold,2) end as avg_sale_price
    from tracks tr
    left join album al on tr.album_id = al.album_id
    left join artist ar on al.artist_id = ar.artist_id
    left join genre g on tr.genre_id = g.genre_id
    left join media m on tr.media_type_id = m.media_type_id
    left join sales on tr.track_id = sales.track_id
)
select * from final 