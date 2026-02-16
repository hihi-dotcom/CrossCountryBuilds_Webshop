package util

import "core:strconv"

QueryParameter :: map[string]string

query_parameter :: proc (unparsed: string) -> (path: string, parameters: QueryParameter) {
    cursor := -1
    for char, i in unparsed {
        if char == '?' {
            cursor = i
            break
        }
    }
    if cursor == -1 do return percent_decode(unparsed), {}
    path = percent_decode(unparsed[:cursor])

    key_start := 0
    key_end := 0
    value_start := 0
    query_string := unparsed[cursor+1:]
    outerFor: for char, i in query_string {
        switch char {
            case '=':
                key_end = i
                value_start = i+1
            case '&':
                if !(key_start <= key_end && value_start <= len(query_string)) do break outerFor
                parameters[percent_decode(plus_decode(query_string[key_start:key_end]))] = percent_decode(plus_decode(query_string[value_start:i])) 
                key_start = i+1
        }
    }
    if !(key_start <= key_end && value_start <= len(query_string)) do return
    parameters[percent_decode(plus_decode(query_string[key_start:key_end]))] = percent_decode(plus_decode(query_string[value_start:])) 

    return
}

@(private = "file")
percent_decode :: proc (to_decode: string) -> string {
    shorter := 0
    mutable := transmute([]u8)to_decode
    for &char, i in mutable {
        if char != '%' do continue
        if !(i + 2 <= len(mutable) - shorter) do continue

        number, ok := strconv.parse_int(to_decode[i+1:i+3], 16)
        if !ok do continue

        char = u8(number)
        shorter += 2
        copy(mutable[i+1:], mutable[i+3:len(mutable)-shorter])
    }
    return to_decode[:len(to_decode) - shorter]
}

@(private = "file")
plus_decode :: proc (to_decode: string) -> string {
    mutable := transmute([]u8)to_decode
    for &char, i in mutable {
        if char != '+' do continue
        char = ' '
    }
    return to_decode
}
