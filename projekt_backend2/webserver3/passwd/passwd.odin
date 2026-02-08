package passwd

import "core:crypto"
import "core:crypto/pbkdf2"
import "core:encoding/base64"
import "core:strconv"

@(private)
ITERATIONS :: 200000
@(private)
ALG_TAG :: "pbkdf2_sha256"
@(private)
SALT_LENGTH :: 32
@(private)
HASH_LENGTH :: 32

@(private)
SALT_B64_LENGTH := ((4 * SALT_LENGTH / 3) + 3) &~ 3
@(private)
HASH_B64_LENGTH := ((4 * HASH_LENGTH / 3) + 3) &~ 3
@(private)
ITERATIONS_STRING_LEHGTH :: 6
@(private)
ALG_TAG_STRING_LENGTH :: 13

hash :: proc (password: string, salt: []u8 = {}) -> string {
    password_bytes := transmute([]u8)password

    salt_buf: [SALT_LENGTH]u8
    if len(salt) == 0 {
        crypto.rand_bytes(salt_buf[:])
    } else {
        copy(salt_buf[:], salt)
    }

    to_store := make([]u8, ALG_TAG_STRING_LENGTH + 1 + ITERATIONS_STRING_LEHGTH + 1 + SALT_B64_LENGTH + 1 + HASH_B64_LENGTH)

    place_for_alg_tag := to_store[:ALG_TAG_STRING_LENGTH]
    place_for_iterations := to_store[ALG_TAG_STRING_LENGTH + 1:ALG_TAG_STRING_LENGTH + 1 + ITERATIONS_STRING_LEHGTH]
    place_for_salt := to_store[ALG_TAG_STRING_LENGTH + 1 + ITERATIONS_STRING_LEHGTH + 1:ALG_TAG_STRING_LENGTH + 1 + ITERATIONS_STRING_LEHGTH + 1 + SALT_B64_LENGTH]
    place_for_hash := to_store[ALG_TAG_STRING_LENGTH + 1 + ITERATIONS_STRING_LEHGTH + 1 + SALT_B64_LENGTH + 1:]

    to_store[ALG_TAG_STRING_LENGTH] = ':'
    to_store[ALG_TAG_STRING_LENGTH + 1 + ITERATIONS_STRING_LEHGTH] = '$'
    to_store[ALG_TAG_STRING_LENGTH + 1 + ITERATIONS_STRING_LEHGTH + 1 + SALT_B64_LENGTH] = '|'

    dst: [HASH_LENGTH]u8
    pbkdf2.derive(.SHA256, password_bytes, salt_buf[:], ITERATIONS, dst[:])
    
    salt_b64 := base64.encode(salt_buf[:])
    defer delete(salt_b64)
    hash_b64 := base64.encode(dst[:])
    defer delete(hash_b64)

    copy(place_for_alg_tag, ALG_TAG)
    strconv.write_uint(place_for_iterations, ITERATIONS, 10)
    copy(place_for_salt, salt_b64)
    copy(place_for_hash, hash_b64)

    return string(to_store)
}

verify :: proc (password: string, hashed: string) -> bool {
    hashed_bytes := (transmute([]u8)hashed)
    password_bytes := transmute([]u8)password

    place_for_salt := hashed_bytes[ALG_TAG_STRING_LENGTH + 1 + ITERATIONS_STRING_LEHGTH + 1:ALG_TAG_STRING_LENGTH + 1 + ITERATIONS_STRING_LEHGTH + 1 + SALT_B64_LENGTH]

    old_salt := base64.decode(string(place_for_salt))
    defer delete(old_salt)

    new_hash := transmute([]u8)hash(password, old_salt)

    if crypto.compare_constant_time(hashed_bytes, new_hash) == 0 do return false
    
    return true
}