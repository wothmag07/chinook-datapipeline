with playlists as (
    select playlist_id, playlist_name
    from {{ ref('stg_playlist') }}
),
playlist_tracks as (
    select playlist_id, track_id
    from {{ ref('stg_playlist_track') }}
),
tracks as (
    select track_id, track_name, list_price, duration_ms, album_id, genre_id, media_type_id
    from {{ ref('stg_track') }}
),
albums as (
    select album_id, album_title, artist_id
    from {{ ref('stg_album') }}
),
artists as (
    select artist_id, artist_name
    from {{ ref('stg_artist') }}
),
genres as (
    select genre_id, genre_name
    from {{ ref('stg_genre') }}
),
media_types as (
    select media_type_id, media_type_name
    from {{ ref('stg_media_type') }}
),
final as (
    select
        {{ dbt_utils.generate_surrogate_key(['pl.playlist_id', 'pt.track_id']) }} as playlist_track_key,
        pl.playlist_id,
        pl.playlist_name,
        pt.track_id,
        tr.track_name,
        tr.list_price,
        tr.duration_ms,
        al.album_title,
        ar.artist_name,
        g.genre_name,
        mt.media_type_name
    from playlists pl
    join playlist_tracks pt on pl.playlist_id = pt.playlist_id
    join tracks tr on pt.track_id = tr.track_id
    left join albums al on tr.album_id = al.album_id
    left join artists ar on al.artist_id = ar.artist_id
    left join genres g on tr.genre_id = g.genre_id
    left join media_types mt on tr.media_type_id = mt.media_type_id
)
select * from final
