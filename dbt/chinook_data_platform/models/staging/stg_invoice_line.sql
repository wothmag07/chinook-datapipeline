with invoice_line as (
    select * from {{ source('chinook_db', 'invoiceline') }}
),
final as (
    select
        invoicelineid as invoice_line_id,
        invoiceid as invoice_id,
        trackid as track_id,
        unitprice as sale_price,
        quantity,
        unitprice * quantity as line_total
    from invoice_line
)
select * from final