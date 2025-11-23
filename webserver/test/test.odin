package test

import "core:fmt"

main :: proc () {
    test := ""
    
    
    fmt.println(strip(test))
}

strip :: proc (s: string) -> string {
    slice_start := 0
    slice_end := len(s)
    for c in s {
        if c == 'a' {
            slice_start += 1
        } else { break }
    }
    #reverse for c in s {
        if c == 'a' {
            slice_end -= 1
        } else { break }
    }
    if slice_start > slice_end do return ""
    return s[slice_start:slice_end]
}
