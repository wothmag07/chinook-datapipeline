with genres as (
    select * from {{ ref('stg_genre') }}
),
sales as (
    select * from {{ ref('int_genre_sales') }}
),
final as (
    select
        g.genre_id,
        g.genre_name,
        coalesce(sales.units_sold,0) as units_sold,
        coalesce(sales.revenue,0) as revenue
    from genres g
    left join sales on g.genre_id = sales.genre_id
)
select * from final 