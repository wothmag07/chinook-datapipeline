-- Dimension model joining playlists, tracks, albums, artists, genres, and media types

with playlists as (
    select * from {{ ref('stg_playlist') }}
),
playlist_tracks as (
    select * from {{ ref('stg_playlist_track') }}
),
tracks as (
    select * from {{ ref('stg_track') }}
),
albums as (
    select * from {{ ref('stg_album') }}
),
artists as (
    select * from {{ ref('stg_artist') }}
),
genres as (
    select * from {{ ref('stg_genre') }}
),
media_types as (
    select * from {{ ref('stg_media_type') }}
),
final as (
    select
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
