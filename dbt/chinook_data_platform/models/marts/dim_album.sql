with albums as (
    select * from {{ ref('stg_album') }}
),
artists as (
    select * from {{ ref('stg_artist') }}
),
sales as (
    select * from {{ ref('int_album_sales') }}
),
final as (
    select
        al.album_id,
        al.album_title,
        ar.artist_id,
        ar.artist_name,
        coalesce(sales.units_sold,0) as units_sold,
        coalesce(sales.revenue,0) as revenue
    from albums al
    left join artists ar on al.artist_id = ar.artist_id
    left join sales on al.album_id = sales.album_id
)
select * from final