with genre as (
    select * from {{ source('chinook_db', 'genre') }}
),
final as (
    select
        genreid as genre_id,
        name as genre_name
    from genre
)
select * from final