with playlist_track as (
    select * from {{ source('chinook_db', 'playlisttrack') }}
),
final as (
    select
        playlistid as playlist_id,
        trackid as track_id
    from playlist_track
)
select * from final