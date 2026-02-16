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
        problem_description = $3
        WHERE id = $1`,
    {.Int4, .Int4, .Text})
}