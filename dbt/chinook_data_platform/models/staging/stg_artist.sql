with artist as (
    select * from {{ source('chinook_db', 'artist') }}
),
final as (
    select
        artistid as artist_id,
        name as artist_name
    from artist
)
select * from final