with media as (
    select * from {{ ref('stg_media_type') }}
),
sales as (
    select * from {{ ref('int_media_sales') }}
),
final as (
    select
        m.media_type_id,
        m.media_type_name,
        coalesce(sales.units_sold,0) as units_sold,
        coalesce(sales.revenue,0) as revenue
    from media m
    left join sales on m.media_type_id = sales.media_type_id
)
select * from final 