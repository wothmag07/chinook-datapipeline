with customers as (
    select * from {{ ref('stg_customer') }}
),
reps as (
    select employee_id, first_name as rep_first_name, last_name as rep_last_name, title as rep_title
    from {{ ref('stg_employee') }}
),
clv as (
    select customer_id, customer_lifetime_value, order_count
    from {{ ref('int_customer_orders') }}
),
final as (
    select
        c.customer_id,
        c.first_name,
        c.last_name,
        c.company,
        c.country,
        c.city,
        c.state,
        c.postal_code,
        c.email,
        c.phone,
        c.support_rep_id,
        r.rep_first_name,
        r.rep_last_name,
        r.rep_title,
        clv.customer_lifetime_value,
        clv.order_count,
        case when clv.order_count = 0 then null else round(clv.customer_lifetime_value/clv.order_count,2) end as avg_order_value
    from customers c
    left join reps r on c.support_rep_id = r.employee_id
    left join clv on c.customer_id = clv.customer_id
)
select * from final 