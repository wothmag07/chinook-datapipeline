with employee as (
    select * from {{ source('chinook_db', 'employee') }}
),
final as (
    select
        employeeid as employee_id,
        lastname as last_name,
        firstname as first_name,
        title,
        reportsto as reports_to,
        cast(birthdate as date) as birth_date,
        cast(hiredate as date) as hire_date,
        address,
        city,
        state,
        country,
        postalcode as postal_code,
        phone,
        fax,
        email
    from employee
)
select * from final