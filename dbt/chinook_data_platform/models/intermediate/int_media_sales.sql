with ts as (
    select * from {{ ref('int_track_sales') }}
),
aggregated as (
    select
        media_type_id,
        sum(units_sold) as units_sold,
        sum(revenue) as revenue
    from ts
    group by 1
)
select * from aggregated 