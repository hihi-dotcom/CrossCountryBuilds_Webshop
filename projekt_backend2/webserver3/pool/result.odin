package pool

import "core:strings"
import "./pq"

import "core:fmt"

Result :: pq.Result

Status :: enum {
    EmptyQuery,
    CommandOK,
    TuplesOK,
    Bad
}

unmarshal :: proc (result: Result) -> []map[string]string {
    nfields := pq.nfields(result)
    ntuples := pq.ntuples(result)
    
    tuples := make([]map[string]string, ntuples)
    for &tuple, row in tuples {
        tuple = make(map[string]string, nfields)
        for field in 0..<nfields {
            tuple[strings.clone_from_cstring(pq.fname(result, field))] = strings.clone_from_cstring(pq.getvalue(result, i32(row), i32(field)))
        }
    }

    pq.clear(result)
    return tuples
}

status :: proc (result: Result) -> (status: Status, error_message: string) {
    pq_status := pq.resultStatus(result)
    #partial switch pq_status {
        case .Tuples_OK:
            return .TuplesOK, ""
        case .Command_OK:
            pq.clear(result)
            return .CommandOK, ""
        case .Empty_Query:
            pq.clear(result)
            return .EmptyQuery, ""
        case:
            error := strings.clone_from_cstring(pq.resultErrorMessage(result))
            pq.clear(result)
            return .Bad, error
    }
}