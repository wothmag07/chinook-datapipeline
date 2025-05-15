with media_type as (
    select * from {{ source('chinook_db', 'mediatype') }}
),
final as (
    select
        mediatypeid as media_type_id,
        name as media_type_name
    from media_type
)
select * from final


