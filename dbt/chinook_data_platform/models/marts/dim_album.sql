with albums as (
    select album_id, album_title, artist_id
    from {{ ref('stg_album') }}
),
artists as (
    select artist_id, artist_name
    from {{ ref('stg_artist') }}
),
sales as (
    select album_id, units_sold, revenue
    from {{ ref('int_album_sales') }}
),
final as (
    select
        {{ dbt_utils.generate_surrogate_key(['al.album_id']) }} as album_key,
        al.album_id,
        al.album_title,
        ar.artist_id,
        ar.artist_name,
        coalesce(sales.units_sold, 0) as units_sold,
        coalesce(sales.revenue, 0) as revenue
    from albums al
    left join artists ar on al.artist_id = ar.artist_id
    left join sales on al.album_id = sales.album_id
)
select * from final
