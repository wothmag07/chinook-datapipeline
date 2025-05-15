with ts as (
    select * from {{ ref('int_track_sales') }}
),
agg as (
    select
        ts.album_id,
        sum(units_sold) as units_sold,
        sum(revenue) as revenue
    from ts
    group by 1
)
select * from agg 