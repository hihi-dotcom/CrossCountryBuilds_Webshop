package response_builder

import "core:net"

@(private="file")
PROTOCOL : []u8 : {'H', 'T', 'T', 'P', '/', '1', '.', '1',}

Response :: struct {
    status: int,
    options: map[string]string,
    body: []u8   
}

Send :: proc(soc: net.TCP_Socket, res: Response) -> (n: int, err: net.TCP_Send_Error) {
    n += net.send_tcp(soc, PROTOCOL) or_return
    n += net.send_tcp(soc, {' '}) or_return
 
    status_bytes := status_to_bytes(res.status)
    n += net.send_tcp(soc, status_bytes[:]) or_return
    n += net.send_tcp(soc, {' '}) or_return
 
    n += net.send_tcp(soc, transmute([]u8)status_to_reason_phrase(res.status)) or_return
    n += net.send_tcp(soc, {'\r', '\n'}) or_return
 
    for k, v in res.options {
        n += net.send_tcp(soc, transmute([]u8)k) or_return
        n += net.send_tcp(soc, {':'}) or_return
        n += net.send_tcp(soc, transmute([]u8)v) or_return
        n += net.send_tcp(soc, {'\r', '\n'}) or_return
    }
    n += net.send_tcp(soc, {'\r', '\n'}) or_return
 
    n += net.send_tcp(soc, res.body) or_return
    return
}

@(private="file")
status_to_bytes :: proc(number: int) -> (bytes: [3]u8) {
    hundreds := number / 100
    tens := (number - (hundreds * 100)) / 10
    ones := (number - (hundreds * 100) - (tens * 10))

    bytes[0] = u8('0') + u8(hundreds)
    bytes[1] = u8('0') + u8(tens)
    bytes[2] = u8('0') + u8(ones)
    return
}

@(private="file")
status_to_reason_phrase :: proc(code: int) -> string {
    switch code {
        // 1xx — Informational
        case 100: return "Continue"
        case 101: return "Switching Protocols"
        case 102: return "Processing"
        case 103: return "Early Hints"
    
        // 2xx — Success
        case 200: return "OK"
        case 201: return "Created"
        case 202: return "Accepted"
        case 203: return "Non-Authoritative Information"
        case 204: return "No Content"
        case 205: return "Reset Content"
        case 206: return "Partial Content"
        case 207: return "Multi-Status"
        case 208: return "Already Reported"
        case 226: return "IM Used"
    
        // 3xx — Redirection
        case 300: return "Multiple Choices"
        case 301: return "Moved Permanently"
        case 302: return "Found"
        case 303: return "See Other"
        case 304: return "Not Modified"
        case 305: return "Use Proxy"
        case 307: return "Temporary Redirect"
        case 308: return "Permanent Redirect"
    
        // 4xx — Client Errors
        case 400: return "Bad Request"
        case 401: return "Unauthorized"
        case 402: return "Payment Required"
        case 403: return "Forbidden"
        case 404: return "Not Found"
        case 405: return "Method Not Allowed"
        case 406: return "Not Acceptable"
        case 407: return "Proxy Authentication Required"
        case 408: return "Request Timeout"
        case 409: return "Conflict"
        case 410: return "Gone"
        case 411: return "Length Required"
        case 412: return "Precondition Failed"
        case 413: return "Payload Too Large"
        case 414: return "URI Too Long"
        case 415: return "Unsupported Media Type"
        case 416: return "Range Not Satisfiable"
        case 417: return "Expectation Failed"
        case 418: return "I'm a teapot"
        case 420: return "Enhance Your Calm"
        case 421: return "Misdirected Request"
        case 422: return "Unprocessable Content"
        case 423: return "Locked"
        case 424: return "Failed Dependency"
        case 425: return "Too Early"
        case 426: return "Upgrade Required"
        case 428: return "Precondition Required"
        case 429: return "Too Many Requests"
        case 431: return "Request Header Fields Too Large"
        case 451: return "Unavailable For Legal Reasons"
    
        // 5xx — Server Errors
        case 500: return "Internal Server Error"
        case 501: return "Not Implemented"
        case 502: return "Bad Gateway"
        case 503: return "Service Unavailable"
        case 504: return "Gateway Timeout"
        case 505: return "HTTP Version Not Supported"
        case 506: return "Variant Also Negotiates"
        case 507: return "Insufficient Storage"
        case 508: return "Loop Detected"
        case 510: return "Not Extended"
        case 511: return "Network Authentication Required"
    
        // Default fallback
        case: return "Unknown Status"
    }
}