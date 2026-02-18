with stg_artists as (
    select artist_id, artist_name
    from {{ ref('stg_artist') }}
),
albums as (
    select artist_id, album_id
    from {{ ref('stg_album') }}
),
album_sales as (
    select album_id, units_sold, revenue
    from {{ ref('int_album_sales') }}
),
album_metrics as (
    select
        al.artist_id,
        count(distinct al.album_id) as number_of_albums,
        coalesce(sum(s.units_sold), 0) as total_units_sold_by_artist,
        coalesce(sum(s.revenue), 0) as total_revenue_by_artist
    from albums al
    left join album_sales s on al.album_id = s.album_id
    group by al.artist_id
),
final as (
    select
        {{ dbt_utils.generate_surrogate_key(['sa.artist_id']) }} as artist_key,
        sa.artist_id,
        sa.artist_name,
        coalesce(am.number_of_albums, 0) as number_of_albums,
        coalesce(am.total_units_sold_by_artist, 0) as total_units_sold_by_artist,
        coalesce(am.total_revenue_by_artist, 0) as total_revenue_by_artist
    from stg_artists sa
    left join album_metrics am on sa.artist_id = am.artist_id
)
select * from final
