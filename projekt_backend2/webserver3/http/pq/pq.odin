package pq

when ODIN_OS == .Windows {
    foreign import pq "../pq/lib/libpq.lib"
} else {
    foreign import pq "system:pq"
}

Conn :: distinct rawptr
Result :: distinct rawptr

ConnStatus :: enum i32 {
    Ok, Bad,
    Started, Made, Awaiting_Response, Auth_OK, Set_Env, 
    SSL_Startup, Needed, Check_Writable, Consume,
    GSSAPI_Startup, Check_Target, Check_Standby, Allocated
}

ExecStatus :: enum i32 {
    Empty_Query,
    Command_OK,
    Tuples_OK,
    Copy_Out,
    Copy_In,
    Bad_Response,
    Non_Fatal_Error,
    Fatal_Error,
    Copy_Both,
    Single_Tuple,
    Pipeline_Sync,
    Pipeline_Aborted,
    Tuples_Chunk
}

@(default_calling_convention="c")
@(link_prefix="PQ")
foreign pq {
    connectdb :: proc (conninfo: cstring) -> Conn ---
    finish :: proc (conn: Conn) ---
    status :: proc (conn: Conn) -> ConnStatus ---
    reset :: proc (conn: Conn) ---
    errorMessage :: proc(conn: Conn) -> cstring ---
    exec :: proc(conn: Conn, command: cstring) -> Result ---
    resultStatus :: proc(res: Result) -> ExecStatus ---
    resultErrorMessage :: proc(res: Result) -> cstring --- 
    ntuples :: proc(res: Result) -> i32 ---
    nfields :: proc(res: Result) -> i32 ---
    fname :: proc(res: Result, col: i32) -> cstring ---
    getvalue :: proc(res: Result, row_number: i32, field_number: i32) -> cstring ---
    clear :: proc(res: Result) ---
    cmdTuples :: proc(res: Result) -> cstring ---
    getisnull :: proc(res: Result, row: i32, col: i32) -> i32 ---
}