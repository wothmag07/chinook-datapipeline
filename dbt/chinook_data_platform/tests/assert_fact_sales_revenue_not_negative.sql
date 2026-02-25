-- Assert that no fact_sales record has negative revenue.
select
    sale_key,
    invoice_line_id,
    quantity,
    sale_price,
    revenue
from {{ ref('fact_sales') }}
where revenue < 0
