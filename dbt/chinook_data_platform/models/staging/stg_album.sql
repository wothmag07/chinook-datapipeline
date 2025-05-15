with source as (
    select * from {{ source('chinook_db', 'album') }}
),

renamed as (
    select
        albumid as album_id,
        title as album_title,
        artistid as artist_id
    from source
)

select * from renamed