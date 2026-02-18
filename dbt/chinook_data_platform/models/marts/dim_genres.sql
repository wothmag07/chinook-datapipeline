with genres as (
    select genre_id, genre_name
    from {{ ref('stg_genre') }}
),
sales as (
    select genre_id, units_sold, revenue
    from {{ ref('int_genre_sales') }}
),
final as (
    select
        {{ dbt_utils.generate_surrogate_key(['g.genre_id']) }} as genre_key,
        g.genre_id,
        g.genre_name,
        coalesce(sales.units_sold, 0) as units_sold,
        coalesce(sales.revenue, 0) as revenue
    from genres g
    left join sales on g.genre_id = sales.genre_id
)
select * from final
