-- Assert that each invoice's total matches the sum of its line items.
-- Returns rows where there is a mismatch (failing test = rows returned).
with invoice_totals as (
    select
        invoice_id,
        invoice_total
    from {{ ref('stg_invoice') }}
),
line_item_totals as (
    select
        invoice_id,
        sum(line_total) as computed_total
    from {{ ref('stg_invoice_line') }}
    group by invoice_id
),
mismatches as (
    select
        inv.invoice_id,
        inv.invoice_total,
        lit.computed_total,
        abs(inv.invoice_total - lit.computed_total) as difference
    from invoice_totals inv
    join line_item_totals lit on inv.invoice_id = lit.invoice_id
    where abs(inv.invoice_total - lit.computed_total) > 0.01
)
select * from mismatches
