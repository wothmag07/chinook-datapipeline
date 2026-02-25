-- Assert that every customer is assigned a valid support representative.
select
    c.customer_id,
    c.full_name,
    c.support_rep_id
from {{ ref('dim_customers') }} c
left join {{ ref('dim_employees') }} e on c.support_rep_id = e.employee_id
where c.support_rep_id is not null
  and e.employee_id is null
