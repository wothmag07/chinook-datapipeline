with dates as (
    {{ dbt_utils.date_spine('day', "'1990-01-01'", "'2030-12-31'") }}
),
final as (
    select
        cast(date_day as date) as date,
        extract(year from date_day) as year,
        extract(month from date_day) as month,
        extract(day from date_day) as day,
        format_date('%Y-%m', date_day) as year_month,
        format_date('%Y-%m-%d', date_day) as date_iso,
        extract(week from date_day) as iso_week,
        extract(quarter from date_day) as quarter,
        case when extract(dayofweek from date_day) in (1,7) then true else false end as is_weekend
    from dates
)
select * from final 