-- Assert that total revenue in dim_tracks matches what fact_sales computes.
-- Tolerance of 0.01 for floating point rounding.
with track_dim_revenue as (
    select sum(revenue) as dim_total
    from {{ ref('dim_tracks') }}
),
fact_revenue as (
    select sum(revenue) as fact_total
    from {{ ref('fact_sales') }}
)
select
    d.dim_total,
    f.fact_total,
    abs(d.dim_total - f.fact_total) as difference
from track_dim_revenue d
cross join fact_revenue f
where abs(d.dim_total - f.fact_total) > 0.01
