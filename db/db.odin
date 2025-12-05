package db 

import "core:fmt"

user_model :: struct #packed {
    hehe: int,
    chars: [20]u8
}

user_model { hehe = 23}

main :: proc ()  {
    fmt.println(size_of(user_model))
    g(user_model)
}

g :: proc ($T: typeid) {
    hehe: T
    fmt.println(typeid_of(T))
}