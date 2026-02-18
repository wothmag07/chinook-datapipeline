with customers as (
    select
        customer_id,
        first_name,
        last_name,
        company,
        address,
        city,
        state,
        country,
        postal_code,
        phone,
        fax,
        email,
        support_rep_id
    from {{ ref('stg_customer') }}
),
reps as (
    select
        employee_id,
        first_name as rep_first_name,
        last_name as rep_last_name,
        title as rep_title
    from {{ ref('stg_employee') }}
),
clv as (
    select
        customer_id,
        customer_lifetime_value,
        order_count,
        first_order_date,
        last_order_date
    from {{ ref('int_customer_orders') }}
),
final as (
    select
        {{ dbt_utils.generate_surrogate_key(['c.customer_id']) }} as customer_key,
        c.customer_id,
        c.first_name,
        c.last_name,
        concat(c.first_name, ' ', c.last_name) as full_name,
        c.company,
        c.address,
        c.city,
        c.state,
        c.country,
        c.postal_code,
        c.email,
        c.phone,
        c.support_rep_id,
        r.rep_first_name,
        r.rep_last_name,
        r.rep_title,
        clv.customer_lifetime_value,
        clv.order_count,
        clv.first_order_date,
        clv.last_order_date,
        case
            when clv.order_count is null or clv.order_count = 0 then null
            else round(clv.customer_lifetime_value / clv.order_count, 2)
        end as avg_order_value
    from customers c
    left join reps r on c.support_rep_id = r.employee_id
    left join clv on c.customer_id = clv.customer_id
)
select * from final
