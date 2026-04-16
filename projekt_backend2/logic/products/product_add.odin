package product

import "../../pool"
import "../../http"
import "../../http/util"
import "core:encoding/json"
import "core:encoding/base64"
import mw "../../http/middleware"
import "../../pool/pool_mw"
import "../auth"
import "core:os"
import "core:fmt"
import "core:strings"
import "core:time"
import "core:crypto"

UPLOAD_DIR: string

@(private = "file")
ProductInput :: struct {
    name: string,
    category: string,
    maker: string,
    description: string,
    price: int,
    stock_number: int,
    image: string,
}

@(private = "file")
JsonResponse :: struct {
    ok: string,
    message: string,
    id: string,
}

product_add :: proc (conn: ^http.Conn) {
    auth.check_admin_mw(conn, proc (conn: ^http.Conn) {
        mw.application_json(conn, product_adder)
    })
}

@(private = "file")
product_adder :: proc (conn: ^http.Conn) {
    body := cast(mw.StaticBody)conn.user_data[mw.StaticBody]

    input: ProductInput
    if json.unmarshal(body^, &input) != nil {
        util.reset(conn, 400, "Json parsing failed")
        return
    }

    url_path := ""
    if len(input.image) > 0 {
        result := save_image(input.image)
        if !result.success {
            util.reset(conn, 400, result.error)
            return
        }
        url_path = result.url_path
    }

    pool_mw.query(conn, product_adder_check, "product_add", 
        {input.name, input.category, input.maker, fmt.aprint(input.price), fmt.aprint(input.stock_number), url_path, input.description})
}

@(private = "file")
product_adder_check :: proc (conn: ^http.Conn) {
    resutl := cast(pool.Result)conn.user_data[pool.Result]

    status, _ := pool.status(resutl)
    if status != .TuplesOK {
        util.reset(conn, 500, "Internal server error.")
        return
    }

    table := pool.unmarshal(resutl)

    jr := JsonResponse{
        ok = "true",
        message = "Product created",
        id = table[0]["id"],
    }

    body_bytes, _ := json.marshal(jr)

    util.static_send(conn.soc, {
        status = 200,
        header = {
            "content-type:application/json"
        },
        body = string(body_bytes)
    })
    http.reset_conn(conn)
}

@(private = "file")
ImageResult :: struct {
    success: bool,
    url_path: string,
    error: string,
}

@(private = "file")
save_image :: proc (base64_data: string) -> ImageResult {
    if !strings.has_prefix(base64_data, "data:image/") {
        return {success = false, error = "Invalid image format"}
    }

    semicolon_idx := strings.index(base64_data, ";")
    comma_idx := strings.index(base64_data, ",")
    
    if semicolon_idx < 0 || comma_idx < 0 {
        return {success = false, error = "Invalid image data URL"}
    }

    mime_type := base64_data[5:semicolon_idx] 
    base64_content := base64_data[comma_idx+1:]

    ext := ".jpg"
    if strings.contains(mime_type, "png")  { ext = ".png" }
    else if strings.contains(mime_type, "webp") { ext = ".webp" }
    else if strings.contains(mime_type, "gif")  { ext = ".gif" }

    timestamp := time.to_unix_nanoseconds(time.now())
    rand_buf: [8]u8
    crypto.rand_bytes(rand_buf[:])
    filename := fmt.aprintf("%d_%x%s", timestamp, rand_buf[:], ext)

    decoded := base64.decode(base64_content)

    _ = os.make_directory(UPLOAD_DIR)

    full_path := fmt.aprintf("%s/%s", UPLOAD_DIR, filename)
    handle, open_err := os.open(full_path, os.O_CREATE | os.O_WRONLY)
    if open_err != nil {
        delete(decoded)
        return {success = false, error = "Failed to create file"}
    }
    os.write(handle, decoded)
    os.close(handle)
    delete(decoded)

    return {success = true, url_path = filename}
}