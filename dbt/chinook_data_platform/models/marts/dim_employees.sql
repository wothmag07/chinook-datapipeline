with reps as (
    select * from {{ ref('stg_employee') }}
),
sales as (
    select * from {{ ref('int_employee_sales') }}
),
final as (
    select
        r.employee_id,
        r.first_name,
        r.last_name,
        r.title,
        r.reports_to,
        r.birth_date,
        date_diff(current_date, r.birth_date, year) as age,
        r.hire_date,
        date_diff(current_date, r.hire_date, year) as experience_years,
        r.address,
        r.city,
        r.state,
        r.country,
        r.postal_code,
        r.phone,
        r.fax,
        r.email,
        coalesce(sales.revenue,0) as revenue,
        coalesce(sales.invoices_handled,0) as invoices_handled,
        coalesce(sales.lines_handled,0) as lines_handled,
        case when coalesce(sales.invoices_handled,0)=0 then null else round(sales.revenue/sales.invoices_handled,2) end as avg_revenue_per_invoice
    from reps r
    left join sales on r.employee_id = sales.employee_id
)
select * from final