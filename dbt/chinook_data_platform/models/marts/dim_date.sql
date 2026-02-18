with dates as (
    {{ dbt_utils.date_spine('day', "'2005-01-01'", "'2030-12-31'") }}
),
final as (
    select
        {{ dbt_utils.generate_surrogate_key(['date_day']) }} as date_key,
        cast(date_day as date) as date,
        extract(year from date_day) as year,
        extract(month from date_day) as month,
        extract(day from date_day) as day,
        format_date('%Y-%m', date_day) as year_month,
        format_date('%Y-%m-%d', date_day) as date_iso,
        format_date('%A', date_day) as day_name,
        format_date('%B', date_day) as month_name,
        extract(isoweek from date_day) as iso_week,
        extract(quarter from date_day) as quarter,
        extract(dayofyear from date_day) as day_of_year,
        extract(dayofweek from date_day) as day_of_week,
        date_trunc(date_day, month) as first_day_of_month,
        last_day(date_day, month) as last_day_of_month,
        date_trunc(date_day, week(monday)) as first_day_of_week,
        case when extract(dayofweek from date_day) in (1, 7) then true else false end as is_weekend
    from dates
)
select * from final
