package appointment

import "../../pool"
import "../../http"

prepare :: proc () {
    pool.prepare("appointment_get_free", `
        SELECT id, service_date 
        FROM Service_DateTimes
        WHERE user_id IS NULL`
    )
    pool.prepare("appoint_appointment", `
        UPDATE Service_DateTimes
        SET user_id = $2,
        problem_description = $3,
        status = 'folyamatban'
        WHERE id = $1`,
    {.Int4, .Int4, .Text})

    pool.prepare("finalize_appointment", `
        UPDATE Service_DateTimes
        SET service_name = $2,
        service_price = $3,
        bringback_date = $4,
        status = 'kész'
        WHERE id = $1`,
    {.Int4, .Varchar, .Int4, .Timestamp})

    pool.prepare("appointment_all", `
        SELECT s.id, s.service_date, s.user_id, s.problem_description, s.service_name, s.service_price, s.bringback_date, s.status, u.username
        FROM Service_DateTimes s
        LEFT JOIN Users u ON s.user_id = u.id
        ORDER BY s.service_date DESC`
    )

    pool.prepare("appointment_delete", `
        DELETE FROM Service_DateTimes
        WHERE id = $1
        RETURNING id`,
    {.Int4})

    pool.prepare("appointment_new", `
        INSERT INTO Service_DateTimes (service_date, user_id)
        VALUES ($1, NULL)
        RETURNING id`,
    {.Timestamp})

    pool.prepare("appointment_by_id", `
        SELECT s.id, s.service_date, s.user_id, s.problem_description, s.service_name, s.service_price, s.bringback_date, s.status, u.username
        FROM Service_DateTimes s
        LEFT JOIN Users u ON s.user_id = u.id
        WHERE s.id = $1`,
    {.Int4})
}