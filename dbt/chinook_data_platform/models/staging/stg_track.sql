with track as (
    select * from {{ source('chinook_db', 'track') }}
),
final as (
    select
        trackid as track_id,
        name as track_name,
        albumid as album_id,
        mediatypeid as media_type_id,
        genreid as genre_id,
        composer,
        milliseconds as duration_ms,
        bytes as file_size,
        unitprice as list_price
    from track
)
select * from final