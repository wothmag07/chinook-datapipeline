with employee as (
    select * from {{ source('chinook_db', 'employee') }}
),
final as (
    select
        employeeid as employee_id,
        trim(firstname) as first_name,
        trim(lastname) as last_name,
        trim(title) as title,
        reportsto as reports_to,
        cast(birthdate as date) as birth_date,
        cast(hiredate as date) as hire_date,
        trim(address) as address,
        trim(city) as city,
        trim(state) as state,
        upper(trim(country)) as country,
        trim(postalcode) as postal_code,
        trim(phone) as phone,
        trim(fax) as fax,
        lower(trim(email)) as email
    from employee
)
select * from final
