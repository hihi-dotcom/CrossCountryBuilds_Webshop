package token

import "core:time"
import "core:crypto"
import "core:crypto/hmac"
import "core:crypto/hash"
import "core:encoding/base64"
import "core:strconv"

@(private)
HASH_LENGTH :: 32
@(private)
TAG_B64_LENGTH := ((4 * HASH_LENGTH / 3) + 3) &~ 3

SECRET: string

sign :: proc (payload: string, valid_for: time.Duration, secret: string = SECRET) -> (token: string) {
    PAYLOAD_B64_LENGTH := ((4 * len(payload) / 3) + 3) &~ 3

    secret_bytes := transmute([]u8)secret
    
    time_buffer: [32]u8
    valid_till := time.time_add(time.now(), valid_for)
    valid_till_string := strconv.write_int(time_buffer[:], time.to_unix_nanoseconds(valid_till), 10)

    token_bytes := make([]u8, len(valid_till_string) + 1 + PAYLOAD_B64_LENGTH + 1 + TAG_B64_LENGTH)

    place_for_time := token_bytes[:len(valid_till_string)]
    place_for_payload := token_bytes[len(place_for_time) + 1:len(token_bytes) - (TAG_B64_LENGTH + 1)]
    place_for_tag := token_bytes[len(token_bytes) - TAG_B64_LENGTH:]
    message := token_bytes[:len(place_for_time) + 1 + len(place_for_payload)]

    token_bytes[len(place_for_time)] = ':'
    token_bytes[len(valid_till_string) + 1 + len(place_for_payload)] = '|'

    copy(place_for_time, valid_till_string)
    copy(place_for_payload, base64.encode(transmute([]u8)payload))
    
    tag_buffer: [HASH_LENGTH]u8
    hmac.sum(.SHA256, tag_buffer[:], message, secret_bytes)

    copy(place_for_tag, base64.encode(tag_buffer[:]))

    return string(token_bytes)
}

verify :: proc (tokenn: string, secret: string = SECRET) -> (payload: string, authentic: bool) {
    if len(tokenn) == 0 do return
    
    secret_bytes := transmute([]u8)secret
    token_bytes := transmute([]u8)tokenn
    
    if len(tokenn) < TAG_B64_LENGTH + 1 do return

    if tokenn[len(tokenn) - TAG_B64_LENGTH - 1] != '|' do return

    tag_b64 := token_bytes[len(token_bytes) - TAG_B64_LENGTH:]
    msg := token_bytes[:len(token_bytes) - TAG_B64_LENGTH - 1]

    tag_bytes := base64.decode(string(tag_b64))

    if !hmac.verify(.SHA256, tag_bytes, msg, secret_bytes) do return

    index_of_separator := 0
    for char, i in msg {
        if char != ':' do continue
        index_of_separator = i
        break
    }
    if index_of_separator == 0 do return

    nanoseconds_valid := strconv.parse_i64(string(msg[:index_of_separator])) or_return
    nanoseconds_now := time.to_unix_nanoseconds(time.now())

    if nanoseconds_valid < nanoseconds_now do return

    authentic = true
    payload_b64 := msg[index_of_separator + 1:]
    payload = string(base64.decode(string(payload_b64)))

    return
}

create_secret :: proc () -> string {
    buf := new([HASH_LENGTH]u8)
    crypto.rand_bytes(buf[:])
    return string(buf[:])
}