with customer as (
    select * from {{ source('chinook_db', 'customer') }}
),
final as (
    select
        customerid as customer_id,
        trim(firstname) as first_name,
        trim(lastname) as last_name,
        trim(company) as company,
        trim(address) as address,
        trim(city) as city,
        trim(state) as state,
        upper(trim(country)) as country,
        trim(postalcode) as postal_code,
        trim(phone) as phone,
        trim(fax) as fax,
        lower(trim(email)) as email,
        supportrepid as support_rep_id
    from customer
)
select * from final
