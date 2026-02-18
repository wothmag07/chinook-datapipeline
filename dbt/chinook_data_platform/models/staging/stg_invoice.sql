with invoice as (
    select * from {{ source('chinook_db', 'invoice') }}
),
final as (
    select
        invoiceid as invoice_id,
        customerid as customer_id,
        cast(invoicedate as date) as invoice_date,
        trim(billingaddress) as billing_address,
        trim(billingcity) as billing_city,
        trim(billingstate) as billing_state,
        upper(trim(billingcountry)) as billing_country,
        trim(billingpostalcode) as billing_postal_code,
        total as invoice_total
    from invoice
)
select * from final
