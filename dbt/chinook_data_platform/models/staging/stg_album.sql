with album as (
    select * from {{ source('chinook_db', 'album') }}
),
final as (
    select
        albumid as album_id,
        trim(title) as album_title,
        artistid as artist_id
    from album
)
select * from final
