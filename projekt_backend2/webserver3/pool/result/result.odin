package result

import "core:strings"
import "../pq"

unmarshal :: proc (result: pq.Result) -> []map[string]string {
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