package util

import "core:os"

load_whole_file :: proc (path: string) -> (file: []u8, len: int, err: os.Error) {
    handle := os.open(path) or_return
    defer os.close(handle)
    info := os.fstat(handle) or_return
    defer os.file_info_delete(info)

    buffer := make([]u8, info.size) or_return
    os.read(handle, buffer) or_return

    return buffer, int(info.size), nil
}