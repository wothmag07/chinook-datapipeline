with playlist as (
    select * from {{ source('chinook_db', 'playlist') }}
),
final as (
    select
        playlistid as playlist_id,
        name as playlist_name
    from playlist
)
select * from final

