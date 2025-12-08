// Complete libpq 18 bindings for Odin
// Based on PostgreSQL 18 libpq documentation
// Covers: connections, queries, async, COPY, large objects, pipeline mode, cancellation, etc.
package pq

import "core:c"

// =============================================================================
// Library Linking
// =============================================================================

when ODIN_OS == .Windows {
    foreign import pq "./libpq.lib"
} else {
    foreign import pq "system:pq"
}

// =============================================================================
// Opaque Handle Types
// =============================================================================

Conn :: distinct rawptr           // PGconn*
Result :: distinct rawptr         // PGresult*
Cancel :: distinct rawptr         // PGcancel*
Cancel_Conn :: distinct rawptr    // PGcancelConn* (PostgreSQL 17+)

// =============================================================================
// Basic Named Types
// =============================================================================

Oid :: distinct c.uint
INVALID_OID :: Oid(0)

Socket :: distinct c.int
INVALID_SOCKET :: Socket(-1)

Backend_PID :: distinct c.int
Row :: distinct c.int
Column :: distinct c.int
Row_Count :: distinct c.int
Column_Count :: distinct c.int
Param_Count :: distinct c.int
Field_Length :: distinct c.int
Field_Size :: distinct c.int

// Large object types
LO_Fd :: distinct c.int           // Large object file descriptor
INVALID_LO_FD :: LO_Fd(-1)

pg_int64 :: distinct c.longlong   // For lo_lseek64, lo_tell64

// =============================================================================
// Result Enums  
// =============================================================================

// Generic 0/1 result
Op_Result :: enum c.int {
    FAILURE = 0,
    SUCCESS = 1,
}

Is_Null :: enum c.int {
    NOT_NULL = 0,
    NULL     = 1,
}

SSL_In_Use :: enum c.int {
    NO  = 0,
    YES = 1,
}

Nonblocking_Status :: enum c.int {
    BLOCKING     = 0,
    NON_BLOCKING = 1,
}

// Return value of PQsetnonblocking: 0 on success, -1 on error
Set_Nonblocking_Result :: enum c.int {
    ERROR   = -1,
    SUCCESS = 0,
}

// PQisBusy: 1 if busy, 0 if not
Busy_Status :: enum c.int {
    NOT_BUSY = 0,
    BUSY     = 1,
}

// Generic boolean-style status for some connection helpers: 1 if yes, 0 if no
Bool_Status :: enum c.int {
    NO  = 0,
    YES = 1,
}

// PQbinaryTuples: 1 if binary, 0 if text
Binary_Tuples :: enum c.int {
    TEXT   = 0,
    BINARY = 1,
}

// Results for some large object operations
LO_Export_Result :: enum c.int {
    ERROR   = -1,
    SUCCESS = 1,
}

LO_Close_Result :: enum c.int {
    ERROR   = -1,
    SUCCESS = 0,
}

LO_Unlink_Result :: enum c.int {
    ERROR   = -1,
    SUCCESS = 1,
}

// PQsetClientEncoding: 0 on success, -1 on error
Set_Client_Encoding_Result :: enum c.int {
    ERROR   = -1,
    SUCCESS = 0,
}

Flush_Result :: enum c.int {
    ERROR       = -1,
    OK          = 0,
    WOULD_BLOCK = 1,
}

Format :: enum c.int {
    TEXT   = 0,
    BINARY = 1,
}

// =============================================================================
// Connection Status Enums
// =============================================================================

Conn_Status :: enum c.int {
    OK                = 0,
    BAD               = 1,
    STARTED           = 2,
    MADE              = 3,
    AWAITING_RESPONSE = 4,
    AUTH_OK           = 5,
    SETENV            = 6,
    SSL_STARTUP       = 7,
    NEEDED            = 8,
    CHECK_WRITABLE    = 9,
    CONSUME           = 10,
    GSS_STARTUP       = 11,
    CHECK_TARGET      = 12,
    CHECK_STANDBY     = 13,
}

Polling_Status :: enum c.int {
    FAILED  = 0,
    READING = 1,
    WRITING = 2,
    OK      = 3,
}

Exec_Status :: enum c.int {
    EMPTY_QUERY      = 0,
    COMMAND_OK       = 1,
    TUPLES_OK        = 2,
    COPY_OUT         = 3,
    COPY_IN          = 4,
    BAD_RESPONSE     = 5,
    NONFATAL_ERROR   = 6,
    FATAL_ERROR      = 7,
    COPY_BOTH        = 8,
    SINGLE_TUPLE     = 9,
    PIPELINE_SYNC    = 10,
    PIPELINE_ABORTED = 11,
    TUPLES_CHUNK     = 12,
}

Transaction_Status :: enum c.int {
    IDLE    = 0,
    ACTIVE  = 1,
    INTRANS = 2,
    INERROR = 3,
    UNKNOWN = 4,
}

Pipeline_Status :: enum c.int {
    OFF   = 0,
    ON    = 1,
    ABORTED = 2,
}

Ping_Status :: enum c.int {
    OK          = 0,
    REJECT      = 1,
    NO_RESPONSE = 2,
    NO_ATTEMPT  = 3,
}

// =============================================================================
// COPY Result
// =============================================================================

Copy_Result :: enum c.int {
    ERROR      = -1,
    OK         = 0,
    WOULD_BLOCK = 1, // For async copy
}

Copy_Data_Result :: enum c.int {
    ERROR       = -2,
    WOULD_BLOCK = -1,
    END         = 0,
    // Positive values = number of bytes
}

// =============================================================================
// Error Field Codes
// =============================================================================

Error_Field :: enum c.int {
    SEVERITY           = 'S',
    SEVERITY_NONLOC    = 'V',
    SQLSTATE           = 'C',
    MESSAGE_PRIMARY    = 'M',
    MESSAGE_DETAIL     = 'D',
    MESSAGE_HINT       = 'H',
    STATEMENT_POSITION = 'P',
    INTERNAL_POSITION  = 'p',
    INTERNAL_QUERY     = 'q',
    CONTEXT            = 'W',
    SCHEMA_NAME        = 's',
    TABLE_NAME         = 't',
    COLUMN_NAME        = 'c',
    DATATYPE_NAME      = 'd',
    CONSTRAINT_NAME    = 'n',
    SOURCE_FILE        = 'F',
    SOURCE_LINE        = 'L',
    SOURCE_FUNCTION    = 'R',
}

// =============================================================================
// Large Object Constants
// =============================================================================

INV_WRITE :: 0x00020000
INV_READ  :: 0x00040000

LO_Seek_Whence :: enum c.int {
    SET = 0,  // SEEK_SET
    CUR = 1,  // SEEK_CUR
    END = 2,  // SEEK_END
}

// =============================================================================
// Structures
// =============================================================================

Notify :: struct {
    relname: cstring,
    be_pid:  Backend_PID,
    extra:   cstring,
}

Conninfo_Option :: struct {
    keyword:  cstring,
    envvar:   cstring,
    compiled: cstring,
    val:      cstring,
    label:    cstring,
    dispchar: cstring,
    dispsize: c.int,
}

Print_Opt :: struct {
    header:      c.int,     // print output field headings
    align:       c.int,     // fill align the fields
    standard:    c.int,     // old/standard format
    html3:       c.int,     // output html tables
    expanded:    c.int,     // expand tables
    pager:       c.int,     // use pager for output
    fieldSep:    cstring,   // field separator
    tableOpt:    cstring,   // attributes for html table
    caption:     cstring,   // caption for html table
    fieldName:   [^]cstring, // null terminated array of field names
}

// =============================================================================
// Foreign Function Bindings
// =============================================================================

@(default_calling_convention = "c")
foreign pq {
    // =========================================================================
    // Connection Control - Blocking
    // =========================================================================
    
    @(link_name = "PQconnectdb")
    connectdb :: proc(conninfo: cstring) -> Conn ---
    
    @(link_name = "PQconnectdbParams")
    connectdb_params :: proc(
        keywords: [^]cstring,
        values: [^]cstring,
        expand_dbname: c.int,
    ) -> Conn ---
    
    @(link_name = "PQsetdbLogin")
    setdb_login :: proc(
        pghost: cstring,
        pgport: cstring,
        pgoptions: cstring,
        pgtty: cstring,
        dbName: cstring,
        login: cstring,
        pwd: cstring,
    ) -> Conn ---
    
    @(link_name = "PQfinish")
    finish :: proc(conn: Conn) ---
    
    @(link_name = "PQreset")
    reset :: proc(conn: Conn) ---
    
    // =========================================================================
    // Connection Control - Non-blocking
    // =========================================================================
    
    @(link_name = "PQconnectStart")
    connect_start :: proc(conninfo: cstring) -> Conn ---
    
    @(link_name = "PQconnectStartParams")
    connect_start_params :: proc(
        keywords: [^]cstring,
        values: [^]cstring,
        expand_dbname: c.int,
    ) -> Conn ---
    
    @(link_name = "PQconnectPoll")
    connect_poll :: proc(conn: Conn) -> Polling_Status ---
    
    @(link_name = "PQresetStart")
    reset_start :: proc(conn: Conn) -> Op_Result ---
    
    @(link_name = "PQresetPoll")
    reset_poll :: proc(conn: Conn) -> Polling_Status ---
    
    // =========================================================================
    // Connection Status
    // =========================================================================
    
    @(link_name = "PQstatus")
    status :: proc(conn: Conn) -> Conn_Status ---
    
    @(link_name = "PQtransactionStatus")
    transaction_status :: proc(conn: Conn) -> Transaction_Status ---
    
    @(link_name = "PQparameterStatus")
    parameter_status :: proc(conn: Conn, paramName: cstring) -> cstring ---
    
    @(link_name = "PQprotocolVersion")
    protocol_version :: proc(conn: Conn) -> c.int ---
    
    @(link_name = "PQserverVersion")
    server_version :: proc(conn: Conn) -> c.int ---
    
    @(link_name = "PQerrorMessage")
    error_message :: proc(conn: Conn) -> cstring ---
    
    @(link_name = "PQsocket")
    socket :: proc(conn: Conn) -> Socket ---
    
    @(link_name = "PQbackendPID")
    backend_pid :: proc(conn: Conn) -> Backend_PID ---
    
    @(link_name = "PQconnectionNeedsPassword")
    connection_needs_password :: proc(conn: Conn) -> Bool_Status ---
    
    @(link_name = "PQconnectionUsedPassword")
    connection_used_password :: proc(conn: Conn) -> Bool_Status ---
    
    @(link_name = "PQconnectionUsedGSSAPI")
    connection_used_gssapi :: proc(conn: Conn) -> Bool_Status ---
    
    @(link_name = "PQsslInUse")
    ssl_in_use :: proc(conn: Conn) -> SSL_In_Use ---
    
    @(link_name = "PQsslAttribute")
    ssl_attribute :: proc(conn: Conn, attribute_name: cstring) -> cstring ---
    
    @(link_name = "PQsslAttributeNames")
    ssl_attribute_names :: proc(conn: Conn) -> [^]cstring ---
    
    @(link_name = "PQsslStruct")
    ssl_struct :: proc(conn: Conn, struct_name: cstring) -> rawptr ---
    
    @(link_name = "PQdb")
    db :: proc(conn: Conn) -> cstring ---
    
    @(link_name = "PQuser")
    user :: proc(conn: Conn) -> cstring ---
    
    @(link_name = "PQpass")
    pass :: proc(conn: Conn) -> cstring ---
    
    @(link_name = "PQhost")
    host :: proc(conn: Conn) -> cstring ---
    
    @(link_name = "PQhostaddr")
    hostaddr :: proc(conn: Conn) -> cstring ---
    
    @(link_name = "PQport")
    port :: proc(conn: Conn) -> cstring ---
    
    @(link_name = "PQoptions")
    options :: proc(conn: Conn) -> cstring ---
    
    // =========================================================================
    // Connection Options
    // =========================================================================
    
    @(link_name = "PQconndefaults")
    conndefaults :: proc() -> [^]Conninfo_Option ---
    
    @(link_name = "PQconninfo")
    conninfo :: proc(conn: Conn) -> [^]Conninfo_Option ---
    
    @(link_name = "PQconninfoParse")
    conninfo_parse :: proc(conninfo: cstring, errmsg: ^cstring) -> [^]Conninfo_Option ---
    
    @(link_name = "PQconninfoFree")
    conninfo_free :: proc(connOptions: [^]Conninfo_Option) ---
    
    // =========================================================================
    // Ping
    // =========================================================================
    
    @(link_name = "PQping")
    ping :: proc(conninfo: cstring) -> Ping_Status ---
    
    @(link_name = "PQpingParams")
    ping_params :: proc(
        keywords: [^]cstring,
        values: [^]cstring,
        expand_dbname: c.int,
    ) -> Ping_Status ---
    
    // =========================================================================
    // Non-blocking Mode
    // =========================================================================
    
    @(link_name = "PQsetnonblocking")
    set_nonblocking :: proc(conn: Conn, arg: Nonblocking_Status) -> Set_Nonblocking_Result ---
    
    @(link_name = "PQisnonblocking")
    is_nonblocking :: proc(conn: Conn) -> Nonblocking_Status ---
    
    @(link_name = "PQflush")
    flush :: proc(conn: Conn) -> Flush_Result ---
    
    // =========================================================================
    // Command Execution - Blocking
    // =========================================================================
    
    @(link_name = "PQexec")
    exec :: proc(conn: Conn, query: cstring) -> Result ---
    
    @(link_name = "PQexecParams")
    exec_params :: proc(
        conn: Conn,
        command: cstring,
        n_params: Param_Count,
        param_types: [^]Oid,
        param_values: [^]cstring,
        param_lengths: [^]c.int,
        param_formats: [^]Format,
        result_format: Format,
    ) -> Result ---
    
    @(link_name = "PQprepare")
    prepare :: proc(
        conn: Conn,
        stmt_name: cstring,
        query: cstring,
        n_params: Param_Count,
        param_types: [^]Oid,
    ) -> Result ---
    
    @(link_name = "PQexecPrepared")
    exec_prepared :: proc(
        conn: Conn,
        stmt_name: cstring,
        n_params: Param_Count,
        param_values: [^]cstring,
        param_lengths: [^]c.int,
        param_formats: [^]Format,
        result_format: Format,
    ) -> Result ---
    
    @(link_name = "PQdescribePrepared")
    describe_prepared :: proc(conn: Conn, stmt_name: cstring) -> Result ---
    
    @(link_name = "PQdescribePortal")
    describe_portal :: proc(conn: Conn, portal_name: cstring) -> Result ---
    
    @(link_name = "PQclosePrepared")
    close_prepared :: proc(conn: Conn, stmt_name: cstring) -> Result ---
    
    @(link_name = "PQclosePortal")
    close_portal :: proc(conn: Conn, portal_name: cstring) -> Result ---
    
    // =========================================================================
    // Command Execution - Async
    // =========================================================================
    
    @(link_name = "PQsendQuery")
    send_query :: proc(conn: Conn, query: cstring) -> Op_Result ---
    
    @(link_name = "PQsendQueryParams")
    send_query_params :: proc(
        conn: Conn,
        command: cstring,
        n_params: Param_Count,
        param_types: [^]Oid,
        param_values: [^]cstring,
        param_lengths: [^]c.int,
        param_formats: [^]Format,
        result_format: Format,
    ) -> Op_Result ---
    
    @(link_name = "PQsendPrepare")
    send_prepare :: proc(
        conn: Conn,
        stmt_name: cstring,
        query: cstring,
        n_params: Param_Count,
        param_types: [^]Oid,
    ) -> Op_Result ---
    
    @(link_name = "PQsendQueryPrepared")
    send_query_prepared :: proc(
        conn: Conn,
        stmt_name: cstring,
        n_params: Param_Count,
        param_values: [^]cstring,
        param_lengths: [^]c.int,
        param_formats: [^]Format,
        result_format: Format,
    ) -> Op_Result ---
    
    @(link_name = "PQsendDescribePrepared")
    send_describe_prepared :: proc(conn: Conn, stmt_name: cstring) -> Op_Result ---
    
    @(link_name = "PQsendDescribePortal")
    send_describe_portal :: proc(conn: Conn, portal_name: cstring) -> Op_Result ---
    
    @(link_name = "PQsendClosePrepared")
    send_close_prepared :: proc(conn: Conn, stmt_name: cstring) -> Op_Result ---
    
    @(link_name = "PQsendClosePortal")
    send_close_portal :: proc(conn: Conn, portal_name: cstring) -> Op_Result ---
    
    @(link_name = "PQconsumeInput")
    consume_input :: proc(conn: Conn) -> Op_Result ---
    
    @(link_name = "PQisBusy")
    is_busy :: proc(conn: Conn) -> Busy_Status ---
    
    @(link_name = "PQgetResult")
    get_result :: proc(conn: Conn) -> Result ---
    
    // =========================================================================
    // Single Row Mode
    // =========================================================================
    
    @(link_name = "PQsetSingleRowMode")
    set_single_row_mode :: proc(conn: Conn) -> Op_Result ---
    
    @(link_name = "PQsetChunkedRowsMode")
    set_chunked_rows_mode :: proc(conn: Conn, chunk_size: c.int) -> Op_Result ---
    
    // =========================================================================
    // Result Status & Info
    // =========================================================================
    
    @(link_name = "PQresultStatus")
    result_status :: proc(res: Result) -> Exec_Status ---
    
    @(link_name = "PQresStatus")
    res_status :: proc(status: Exec_Status) -> cstring ---
    
    @(link_name = "PQresultErrorMessage")
    result_error_message :: proc(res: Result) -> cstring ---
    
    @(link_name = "PQresultVerboseErrorMessage")
    result_verbose_error_message :: proc(
        res: Result,
        verbosity: c.int,
        show_context: c.int,
    ) -> cstring ---
    
    @(link_name = "PQresultErrorField")
    result_error_field :: proc(res: Result, fieldcode: Error_Field) -> cstring ---
    
    @(link_name = "PQclear")
    clear :: proc(res: Result) ---
    
    // =========================================================================
    // Result Data Access
    // =========================================================================
    
    @(link_name = "PQntuples")
    ntuples :: proc(res: Result) -> Row_Count ---
    
    @(link_name = "PQnfields")
    nfields :: proc(res: Result) -> Column_Count ---
    
    @(link_name = "PQfname")
    fname :: proc(res: Result, column_number: Column) -> cstring ---
    
    @(link_name = "PQfnumber")
    fnumber :: proc(res: Result, column_name: cstring) -> Column ---
    
    @(link_name = "PQftable")
    ftable :: proc(res: Result, column_number: Column) -> Oid ---
    
    @(link_name = "PQftablecol")
    ftablecol :: proc(res: Result, column_number: Column) -> Column ---
    
    @(link_name = "PQfformat")
    fformat :: proc(res: Result, column_number: Column) -> Format ---
    
    @(link_name = "PQftype")
    ftype :: proc(res: Result, column_number: Column) -> Oid ---
    
    @(link_name = "PQfmod")
    fmod :: proc(res: Result, column_number: Column) -> c.int ---
    
    @(link_name = "PQfsize")
    fsize :: proc(res: Result, column_number: Column) -> Field_Size ---
    
    @(link_name = "PQbinaryTuples")
    binary_tuples :: proc(res: Result) -> Binary_Tuples ---
    
    @(link_name = "PQgetvalue")
    getvalue :: proc(res: Result, row: Row, column: Column) -> [^]u8 ---
    
    @(link_name = "PQgetisnull")
    getisnull :: proc(res: Result, row: Row, column: Column) -> Is_Null ---
    
    @(link_name = "PQgetlength")
    getlength :: proc(res: Result, row: Row, column: Column) -> Field_Length ---
    
    @(link_name = "PQnparams")
    nparams :: proc(res: Result) -> Param_Count ---
    
    @(link_name = "PQparamtype")
    paramtype :: proc(res: Result, param_number: c.int) -> Oid ---
    
    @(link_name = "PQcmdStatus")
    cmd_status :: proc(res: Result) -> cstring ---
    
    @(link_name = "PQcmdTuples")
    cmd_tuples :: proc(res: Result) -> cstring ---
    
    @(link_name = "PQoidValue")
    oid_value :: proc(res: Result) -> Oid ---
    
    // =========================================================================
    // Escaping
    // =========================================================================
    
    @(link_name = "PQescapeLiteral")
    escape_literal :: proc(conn: Conn, str: cstring, length: c.size_t) -> cstring ---
    
    @(link_name = "PQescapeIdentifier")
    escape_identifier :: proc(conn: Conn, str: cstring, length: c.size_t) -> cstring ---
    
    @(link_name = "PQescapeStringConn")
    escape_string_conn :: proc(
        conn: Conn,
        to: [^]u8,
        from: cstring,
        length: c.size_t,
        error: ^c.int,
    ) -> c.size_t ---
    
    @(link_name = "PQescapeByteaConn")
    escape_bytea_conn :: proc(
        conn: Conn,
        from: [^]u8,
        from_length: c.size_t,
        to_length: ^c.size_t,
    ) -> [^]u8 ---
    
    @(link_name = "PQunescapeBytea")
    unescape_bytea :: proc(
        from: [^]u8,
        to_length: ^c.size_t,
    ) -> [^]u8 ---
    
    // =========================================================================
    // Memory Management
    // =========================================================================
    
    @(link_name = "PQfreemem")
    freemem :: proc(ptr: rawptr) ---
    
    @(link_name = "PQmakeEmptyPGresult")
    make_empty_result :: proc(conn: Conn, status: Exec_Status) -> Result ---
    
    // =========================================================================
    // COPY Functions
    // =========================================================================
    
    @(link_name = "PQputCopyData")
    put_copy_data :: proc(conn: Conn, buffer: [^]u8, nbytes: c.int) -> Copy_Result ---
    
    @(link_name = "PQputCopyEnd")
    put_copy_end :: proc(conn: Conn, errormsg: cstring) -> Copy_Result ---
    
    @(link_name = "PQgetCopyData")
    get_copy_data :: proc(conn: Conn, buffer: ^[^]u8, async: c.int) -> c.int ---
    
    // =========================================================================
    // Pipeline Mode (PostgreSQL 14+)
    // =========================================================================
    
    @(link_name = "PQpipelineStatus")
    pipeline_status :: proc(conn: Conn) -> Pipeline_Status ---
    
    @(link_name = "PQenterPipelineMode")
    enter_pipeline_mode :: proc(conn: Conn) -> Op_Result ---
    
    @(link_name = "PQexitPipelineMode")
    exit_pipeline_mode :: proc(conn: Conn) -> Op_Result ---
    
    @(link_name = "PQpipelineSync")
    pipeline_sync :: proc(conn: Conn) -> Op_Result ---
    
    @(link_name = "PQsendFlushRequest")
    send_flush_request :: proc(conn: Conn) -> Op_Result ---
    
    @(link_name = "PQsendPipelineSync")
    send_pipeline_sync :: proc(conn: Conn) -> Op_Result ---
    
    // =========================================================================
    // Cancel (Legacy)
    // =========================================================================
    
    @(link_name = "PQgetCancel")
    get_cancel :: proc(conn: Conn) -> Cancel ---
    
    @(link_name = "PQfreeCancel")
    free_cancel :: proc(cancel: Cancel) ---
    
    @(link_name = "PQcancel")
    cancel :: proc(cancel: Cancel, errbuf: [^]u8, errbufsize: c.int) -> Op_Result ---
    
    @(link_name = "PQrequestCancel")
    request_cancel :: proc(conn: Conn) -> Op_Result ---
    
    // =========================================================================
    // Cancel (PostgreSQL 17+ - non-blocking)
    // =========================================================================
    
    @(link_name = "PQcancelCreate")
    cancel_create :: proc(conn: Conn) -> Cancel_Conn ---
    
    @(link_name = "PQcancelBlocking")
    cancel_blocking :: proc(cancelConn: Cancel_Conn) -> Op_Result ---
    
    @(link_name = "PQcancelStart")
    cancel_start :: proc(cancelConn: Cancel_Conn) -> Op_Result ---
    
    @(link_name = "PQcancelPoll")
    cancel_poll :: proc(cancelConn: Cancel_Conn) -> Polling_Status ---
    
    @(link_name = "PQcancelStatus")
    cancel_status :: proc(cancelConn: Cancel_Conn) -> Conn_Status ---
    
    @(link_name = "PQcancelSocket")
    cancel_socket :: proc(cancelConn: Cancel_Conn) -> Socket ---
    
    @(link_name = "PQcancelErrorMessage")
    cancel_error_message :: proc(cancelConn: Cancel_Conn) -> cstring ---
    
    @(link_name = "PQcancelFinish")
    cancel_finish :: proc(cancelConn: Cancel_Conn) ---
    
    @(link_name = "PQcancelReset")
    cancel_reset :: proc(cancelConn: Cancel_Conn) ---
    
    // =========================================================================
    // Asynchronous Notification
    // =========================================================================
    
    @(link_name = "PQnotifies")
    notifies :: proc(conn: Conn) -> ^Notify ---
    
    // =========================================================================
    // Large Objects
    // =========================================================================
    
    @(link_name = "lo_create")
    lo_create :: proc(conn: Conn, lobjId: Oid) -> Oid ---
    
    @(link_name = "lo_creat")
    lo_creat :: proc(conn: Conn, mode: c.int) -> Oid ---
    
    @(link_name = "lo_import")
    lo_import :: proc(conn: Conn, filename: cstring) -> Oid ---
    
    @(link_name = "lo_import_with_oid")
    lo_import_with_oid :: proc(conn: Conn, filename: cstring, lobjId: Oid) -> Oid ---
    
    @(link_name = "lo_export")
    lo_export :: proc(conn: Conn, lobjId: Oid, filename: cstring) -> LO_Export_Result ---
    
    @(link_name = "lo_open")
    lo_open :: proc(conn: Conn, lobjId: Oid, mode: c.int) -> LO_Fd ---
    
    @(link_name = "lo_close")
    lo_close :: proc(conn: Conn, fd: LO_Fd) -> LO_Close_Result ---
    
    @(link_name = "lo_read")
    lo_read :: proc(conn: Conn, fd: LO_Fd, buf: [^]u8, len: c.size_t) -> c.int ---
    
    @(link_name = "lo_write")
    lo_write :: proc(conn: Conn, fd: LO_Fd, buf: [^]u8, len: c.size_t) -> c.int ---
    
    @(link_name = "lo_lseek")
    lo_lseek :: proc(conn: Conn, fd: LO_Fd, offset: c.int, whence: LO_Seek_Whence) -> c.int ---
    
    @(link_name = "lo_lseek64")
    lo_lseek64 :: proc(conn: Conn, fd: LO_Fd, offset: pg_int64, whence: LO_Seek_Whence) -> pg_int64 ---
    
    @(link_name = "lo_tell")
    lo_tell :: proc(conn: Conn, fd: LO_Fd) -> c.int ---
    
    @(link_name = "lo_tell64")
    lo_tell64 :: proc(conn: Conn, fd: LO_Fd) -> pg_int64 ---
    
    @(link_name = "lo_truncate")
    lo_truncate :: proc(conn: Conn, fd: LO_Fd, len: c.size_t) -> c.int ---
    
    @(link_name = "lo_truncate64")
    lo_truncate64 :: proc(conn: Conn, fd: LO_Fd, len: pg_int64) -> c.int ---
    
    @(link_name = "lo_unlink")
    lo_unlink :: proc(conn: Conn, lobjId: Oid) -> LO_Unlink_Result ---
    
    // =========================================================================
    // Tracing
    // =========================================================================
    
    @(link_name = "PQtrace")
    trace :: proc(conn: Conn, debug_port: rawptr) ---  // FILE*
    
    @(link_name = "PQuntrace")
    untrace :: proc(conn: Conn) ---
    
    @(link_name = "PQsetTraceFlags")
    set_trace_flags :: proc(conn: Conn, flags: c.int) ---
    
    // =========================================================================
    // Miscellaneous
    // =========================================================================
    
    @(link_name = "PQclientEncoding")
    client_encoding :: proc(conn: Conn) -> c.int ---
    
    @(link_name = "PQsetClientEncoding")
    set_client_encoding :: proc(conn: Conn, encoding: cstring) -> Set_Client_Encoding_Result ---
    
    @(link_name = "pg_encoding_to_char")
    encoding_to_char :: proc(encoding_id: c.int) -> cstring ---
    
    @(link_name = "pg_char_to_encoding")
    char_to_encoding :: proc(name: cstring) -> c.int ---
    
    @(link_name = "pg_valid_server_encoding_id")
    valid_server_encoding_id :: proc(encoding_id: c.int) -> c.int ---
    
    @(link_name = "PQlibVersion")
    lib_version :: proc() -> c.int ---
    
    @(link_name = "PQsetErrorVerbosity")
    set_error_verbosity :: proc(conn: Conn, verbosity: c.int) -> c.int ---
    
    @(link_name = "PQsetErrorContextVisibility")
    set_error_context_visibility :: proc(conn: Conn, show_context: c.int) -> c.int ---
    
    // =========================================================================
    // Notice Processing
    // =========================================================================
    
    // Note: Notice receivers/processors use function pointers
    // Type definitions provided, but setting them requires casting
    
    @(link_name = "PQsetNoticeReceiver")
    set_notice_receiver :: proc(
        conn: Conn, 
        proc_: rawptr,  // PQnoticeReceiver function pointer
        arg: rawptr,
    ) -> rawptr ---
    
    @(link_name = "PQsetNoticeProcessor")
    set_notice_processor :: proc(
        conn: Conn,
        proc_: rawptr,  // PQnoticeProcessor function pointer
        arg: rawptr,
    ) -> rawptr ---
    
    // =========================================================================
    // Event System (for extending libpq)
    // =========================================================================
    
    @(link_name = "PQregisterEventProc")
    register_event_proc :: proc(
        conn: Conn,
        proc_: rawptr,  // PGEventProc
        name: cstring,
        passThrough: rawptr,
    ) -> Op_Result ---
    
    @(link_name = "PQsetInstanceData")
    set_instance_data :: proc(conn: Conn, proc_: rawptr, data: rawptr) -> Op_Result ---
    
    @(link_name = "PQinstanceData")
    instance_data :: proc(conn: Conn, proc_: rawptr) -> rawptr ---
    
    @(link_name = "PQresultSetInstanceData")
    result_set_instance_data :: proc(res: Result, proc_: rawptr, data: rawptr) -> Op_Result ---
    
    @(link_name = "PQresultInstanceData")
    result_instance_data :: proc(res: Result, proc_: rawptr) -> rawptr ---
    
    @(link_name = "PQfireResultCreateEvents")
    fire_result_create_events :: proc(conn: Conn, res: Result) -> Op_Result ---
}

// =============================================================================
// Trace Flags
// =============================================================================

TRACE_SUPPRESS_TIMESTAMPS :: 1
TRACE_REGRESS_MODE        :: 2

// =============================================================================
// Verbosity Constants
// =============================================================================

ERRORS_TERSE   :: 0
ERRORS_DEFAULT :: 1
ERRORS_VERBOSE :: 2
ERRORS_SQLSTATE :: 3

SHOW_CONTEXT_NEVER  :: 0
SHOW_CONTEXT_ERRORS :: 1
SHOW_CONTEXT_ALWAYS :: 2

// =============================================================================
// Helper Functions
// =============================================================================

get_value_string :: proc(res: Result, row: Row, column: Column) -> string {
    if getisnull(res, row, column) == .NULL {
        return ""
    }
    ptr := getvalue(res, row, column)
    len := getlength(res, row, column)
    if ptr == nil || len <= 0 {
        return ""
    }
    return string(ptr[:len])
}

is_connected :: proc(conn: Conn) -> bool {
    return conn != nil && status(conn) == .OK
}

is_success :: proc(res: Result) -> bool {
    if res == nil {
        return false
    }
    s := result_status(res)
    #partial switch s {
    case .COMMAND_OK, .TUPLES_OK, .SINGLE_TUPLE, .TUPLES_CHUNK:
        return true
    }
    return false
}

is_valid_socket :: proc(sock: Socket) -> bool {
    return sock >= Socket(0)
}

// Drain all remaining results from connection
drain_results :: proc(conn: Conn) {
    for {
        res := get_result(conn)
        if res == nil do break
        clear(res)
    }
}

// Execute query and drain results, returning last result
exec_and_drain :: proc(conn: Conn, query: cstring) -> Result {
    res := exec(conn, query)
    // exec() already handles draining internally
    return res
}

// =============================================================================
// Result Iterator
// =============================================================================

Result_Iterator :: struct {
    res:     Result,
    row:     Row,
    col:     Column,
    n_rows:  Row_Count,
    n_cols:  Column_Count,
}

make_result_iterator :: proc(res: Result) -> Result_Iterator {
    return Result_Iterator{
        res    = res,
        row    = 0,
        col    = 0,
        n_rows = ntuples(res),
        n_cols = nfields(res),
    }
}

iterate_cells :: proc(it: ^Result_Iterator) -> (value: string, row: Row, col: Column, ok: bool) {
    if it.row >= Row(it.n_rows) {
        return "", 0, 0, false
    }
    
    value = get_value_string(it.res, it.row, it.col)
    row = it.row
    col = it.col
    
    it.col += 1
    if it.col >= Column(it.n_cols) {
        it.col = 0
        it.row += 1
    }
    
    return value, row, col, true
}

iterate_rows :: proc(it: ^Result_Iterator) -> (row: Row, ok: bool) {
    if it.row >= Row(it.n_rows) {
        return 0, false
    }
    row = it.row
    it.row += 1
    return row, true
}