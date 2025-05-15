with invoice as (
    select * from {{ source('chinook_db', 'invoice') }}
),
final as (
    select
        invoiceid as invoice_id,
        customerid as customer_id,
        cast(invoicedate as date) as invoice_date,
        billingaddress as billing_address,
        billingcity as billing_city,
        billingstate as billing_state,
        billingcountry as billing_country,
        billingpostalcode as billing_postal_code,
        total as invoice_total
    from invoice
)
select * from final