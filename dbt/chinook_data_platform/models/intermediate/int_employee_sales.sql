with inv as (
    select invoice_id, customer_id, invoice_date
    from {{ ref('stg_invoice') }}
),
customers as (
    select customer_id, support_rep_id
    from {{ ref('stg_customer') }}
),
reps as (
    select employee_id, first_name, last_name, title
    from {{ ref('stg_employee') }}
),
il as (
    select invoice_id, sale_price, quantity
    from {{ ref('stg_invoice_line') }}
),
joined as (
    select
        reps.employee_id,
        reps.first_name,
        reps.last_name,
        reps.title,
        inv.invoice_id,
        inv.invoice_date,
        il.sale_price * il.quantity as line_revenue
    from inv
    join customers c on inv.customer_id = c.customer_id
    join reps on c.support_rep_id = reps.employee_id
    join il on inv.invoice_id = il.invoice_id
),
aggregated as (
    select
        employee_id,
        first_name,
        last_name,
        title,
        sum(line_revenue) as revenue,
        count(distinct invoice_id) as invoices_handled,
        count(*) as lines_handled
    from joined
    group by 1,2,3,4
)
select * from aggregated 