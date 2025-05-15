with customer as (
    select * from {{ source('chinook_db', 'customer') }}
),
final as (
    select
        customerid as customer_id,
        firstname as first_name,
        lastname as last_name,
        company,
        address,
        city,
        state,
        upper(country) as country,  -- Standardize country names
        postalcode as postal_code,
        case 
            when phone is null then 'Unknown'
            else phone 
        end as phone,  -- Handle NULL phone numbers
        case 
            when fax is null then 'Unknown'
            else fax 
        end as fax,  -- Handle NULL fax numbers
        case 
            when email is null then 'Unknown'
            else lower(email)  -- Standardize email to lowercase
        end as email,
        supportrepid as support_rep_id
    from customer
)
select * from final