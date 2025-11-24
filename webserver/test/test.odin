package test

import "core:mem"
import "base:runtime"
import "core:fmt"
import vmem "core:mem/virtual"

TEST :: proc() 

main :: proc () {
    test := "asdf"
    n := 0
    for i := 0 ; i < 2 ; i += 1 {
        fmt.println(rune(test[i]), n)
        n += 1
    }
    for i := n ; i < len(test) ; i += 1 {
        fmt.println(rune(test[i]), n)
        n += 1
    }
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
