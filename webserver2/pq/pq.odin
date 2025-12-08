// Minimal libpq 18 bindings for Odin - Non-blocking async usage
// Based on PostgreSQL 18 libpq documentation
package pq

import "core:c"

// Link to libpq system library
when ODIN_OS == .Windows {
    foreign import pq "system:libpq.lib"
} else {
    foreign import pq "system:pq"
}

// =============================================================================
// Opaque Types
// =============================================================================

// Connection handle - opaque struct
Conn :: distinct rawptr

// Result handle - opaque struct  
Result :: distinct rawptr

// =============================================================================
// Basic Named Types
// =============================================================================

// OID type (PostgreSQL object identifier)
Oid :: distinct c.uint
INVALID_OID :: Oid(0)

// Socket file descriptor
Socket :: distinct c.int
INVALID_SOCKET :: Socket(-1)

// Backend process ID
Backend_PID :: distinct c.int

// Row index (0-based)
Row :: distinct c.int

// Column index (0-based)
Column :: distinct c.int

// Number of rows
Row_Count :: distinct c.int

// Number of columns  
Column_Count :: distinct c.int

// Number of parameters
Param_Count :: distinct c.int

// Field length in bytes
Field_Length :: distinct c.int

// Field size (-1 for variable length types)
Field_Size :: distinct c.int

// =============================================================================
// Boolean-like Return Types
// =============================================================================

// Generic success/failure for operations that return 1/0
Op_Result :: enum c.int {
    FAILURE = 0,
    SUCCESS = 1,
}

// Result of PQgetisnull
Is_Null :: enum c.int {
    NOT_NULL = 0,
    NULL     = 1,
}

// Result of PQsslInUse
SSL_In_Use :: enum c.int {
    NO  = 0,
    YES = 1,
}

// Result of PQisnonblocking
Nonblocking_Status :: enum c.int {
    BLOCKING     = 0,
    NON_BLOCKING = 1,
}

// =============================================================================
// Flush Result
// =============================================================================

Flush_Result :: enum c.int {
    ERROR        = -1, // Flush failed
    OK           = 0,  // All data flushed successfully
    WOULD_BLOCK  = 1,  // Not all data sent, need to retry when socket writable
}

// =============================================================================
// Format Types
// =============================================================================

// Field format (text vs binary)
Format :: enum c.int {
    TEXT   = 0,
    BINARY = 1,
}

// =============================================================================
// Connection Status Enums
// =============================================================================

// Connection status returned by PQstatus
Conn_Status :: enum c.int {
    OK                    = 0,  // Connection is ready
    BAD                   = 1,  // Connection failed
    // Async connection states (only during PQconnectPoll)
    STARTED               = 2,  // Waiting for connection to be made
    MADE                  = 3,  // Connection OK; waiting to send
    AWAITING_RESPONSE     = 4,  // Waiting for server response
    AUTH_OK               = 5,  // Received authentication
    SETENV                = 6,  // Negotiating environment
    SSL_STARTUP           = 7,  // Negotiating SSL
    NEEDED                = 8,  // Internal state
    CHECK_WRITABLE        = 9,  // Checking if writable
    CONSUME               = 10, // Consuming remaining responses
    GSS_STARTUP           = 11, // Negotiating GSSAPI
    CHECK_TARGET          = 12, // Checking target server
    CHECK_STANDBY         = 13, // Checking if standby
}

// Polling status for async operations
Polling_Status :: enum c.int {
    FAILED  = 0,
    READING = 1,  // Wait until socket is readable, then poll again
    WRITING = 2,  // Wait until socket is writable, then poll again
    OK      = 3,  // Operation complete
}

// Result status from PQresultStatus
Exec_Status :: enum c.int {
    EMPTY_QUERY      = 0,  // Empty query string
    COMMAND_OK       = 1,  // Command completed, no data returned
    TUPLES_OK        = 2,  // Query returned tuples
    COPY_OUT         = 3,  // Copy Out data transfer started
    COPY_IN          = 4,  // Copy In data transfer started
    BAD_RESPONSE     = 5,  // Server response not understood
    NONFATAL_ERROR   = 6,  // Notice or warning
    FATAL_ERROR      = 7,  // Query failed
    COPY_BOTH        = 8,  // Copy In/Out data transfer
    SINGLE_TUPLE     = 9,  // Single tuple from PQgetResult
    PIPELINE_SYNC    = 10, // Pipeline sync point
    PIPELINE_ABORTED = 11, // Command aborted in pipeline
    TUPLES_CHUNK     = 12, // Chunk of tuples
}

// Transaction status
Transaction_Status :: enum c.int {
    IDLE    = 0, // Connection idle
    ACTIVE  = 1, // Command in progress
    INTRANS = 2, // Idle, in transaction block
    INERROR = 3, // Idle, in failed transaction
    UNKNOWN = 4, // Cannot determine status
}

// =============================================================================
// Foreign Function Bindings
// =============================================================================

@(default_calling_convention = "c")
foreign pq {
    // =========================================================================
    // Connection Control - Non-blocking
    // =========================================================================

    // Start async connection with connection string
    // Returns: Conn (always non-nil, check status() for success)
    @(link_name = "PQconnectStart")
    connect_start :: proc(conninfo: cstring) -> Conn ---

    // Start async connection with keyword/value arrays
    // keywords and values must be null-terminated arrays
    // expand_dbname: if non-zero, first dbname value is checked for connection string format
    // Returns: Conn (always non-nil, check status() for success)
    @(link_name = "PQconnectStartParams")
    connect_start_params :: proc(
        keywords: [^]cstring,
        values: [^]cstring, 
        expand_dbname: c.int,
    ) -> Conn ---

    // Poll connection during async connect
    // Returns: READING (wait for readable), WRITING (wait for writable), OK (done), FAILED (error)
    @(link_name = "PQconnectPoll")
    connect_poll :: proc(conn: Conn) -> Polling_Status ---

    // Close connection and free memory
    // Must be called even if connection failed
    @(link_name = "PQfinish")
    finish :: proc(conn: Conn) ---

    // Start non-blocking connection reset
    // Returns: SUCCESS if reset started, FAILURE if failed immediately
    @(link_name = "PQresetStart")
    reset_start :: proc(conn: Conn) -> Op_Result ---

    // Poll reset progress (same as connect_poll)
    @(link_name = "PQresetPoll")
    reset_poll :: proc(conn: Conn) -> Polling_Status ---

    // =========================================================================
    // Connection Status
    // =========================================================================

    // Get connection status
    @(link_name = "PQstatus")
    status :: proc(conn: Conn) -> Conn_Status ---

    // Get transaction status
    @(link_name = "PQtransactionStatus")
    transaction_status :: proc(conn: Conn) -> Transaction_Status ---

    // Get error message from connection
    @(link_name = "PQerrorMessage")
    error_message :: proc(conn: Conn) -> cstring ---

    // Get socket file descriptor for select()/poll()
    // Returns: valid socket or INVALID_SOCKET (-1) if no connection
    @(link_name = "PQsocket")
    socket :: proc(conn: Conn) -> Socket ---

    // Get backend PID
    @(link_name = "PQbackendPID")
    backend_pid :: proc(conn: Conn) -> Backend_PID ---

    // Check if connection uses SSL
    @(link_name = "PQsslInUse") 
    ssl_in_use :: proc(conn: Conn) -> SSL_In_Use ---

    // Get database name
    @(link_name = "PQdb")
    db :: proc(conn: Conn) -> cstring ---

    // Get user name
    @(link_name = "PQuser")
    user :: proc(conn: Conn) -> cstring ---

    // Get host
    @(link_name = "PQhost")
    host :: proc(conn: Conn) -> cstring ---

    // Get port
    @(link_name = "PQport")
    port :: proc(conn: Conn) -> cstring ---

    // =========================================================================
    // Non-blocking Mode Control
    // =========================================================================

    // Set connection to non-blocking mode (arg=1) or blocking mode (arg=0)
    // Returns: SUCCESS (0) on success, FAILURE (-1) on error
    @(link_name = "PQsetnonblocking")
    set_nonblocking :: proc(conn: Conn, arg: Nonblocking_Status) -> Op_Result ---

    // Check if connection is in non-blocking mode
    @(link_name = "PQisnonblocking")
    is_nonblocking :: proc(conn: Conn) -> Nonblocking_Status ---

    // Flush output buffer
    // Returns: OK (0) success, ERROR (-1) failure, WOULD_BLOCK (1) need retry
    @(link_name = "PQflush")
    flush :: proc(conn: Conn) -> Flush_Result ---

    // =========================================================================
    // Async Query Execution
    // =========================================================================

    // Send query without waiting (not for pipeline mode)
    // Returns: SUCCESS if dispatched, FAILURE if not
    @(link_name = "PQsendQuery")
    send_query :: proc(conn: Conn, query: cstring) -> Op_Result ---

    // Send query with parameters
    // paramTypes: nil to let server infer types
    // paramLengths: nil for null-terminated text params
    // paramFormats: nil for all text, or array of Format values
    // resultFormat: TEXT (0) or BINARY (1)
    // Returns: SUCCESS if dispatched, FAILURE if not
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

    // Send prepared statement creation request
    // Returns: SUCCESS if dispatched, FAILURE if not
    @(link_name = "PQsendPrepare")
    send_prepare :: proc(
        conn: Conn,
        stmt_name: cstring,
        query: cstring,
        n_params: Param_Count,
        param_types: [^]Oid,
    ) -> Op_Result ---

    // Execute prepared statement asynchronously
    // Returns: SUCCESS if dispatched, FAILURE if not
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

    // =========================================================================
    // Async Result Retrieval
    // =========================================================================

    // Consume input from server (call when socket is readable)
    // Returns: SUCCESS (1) if ok, FAILURE (0) if error
    @(link_name = "PQconsumeInput")
    consume_input :: proc(conn: Conn) -> Op_Result ---

    // Check if PQgetResult would block
    // Returns: SUCCESS (1) if busy/would block, FAILURE (0) if result ready
    @(link_name = "PQisBusy")
    is_busy :: proc(conn: Conn) -> Op_Result ---

    // Get next result from async query
    // Returns: Result handle, or nil when command complete
    // Must call repeatedly until nil to consume all results
    @(link_name = "PQgetResult")
    get_result :: proc(conn: Conn) -> Result ---

    // =========================================================================
    // Result Status & Info
    // =========================================================================

    // Get result status
    @(link_name = "PQresultStatus")
    result_status :: proc(res: Result) -> Exec_Status ---

    // Get error message from result
    @(link_name = "PQresultErrorMessage")
    result_error_message :: proc(res: Result) -> cstring ---

    // Get error field (use PG_DIAG_* constants)
    @(link_name = "PQresultErrorField")
    result_error_field :: proc(res: Result, fieldcode: Error_Field) -> cstring ---

    // Free result memory - must be called for every result
    @(link_name = "PQclear")
    clear :: proc(res: Result) ---

    // =========================================================================
    // Result Data Access
    // =========================================================================

    // Number of rows in result
    @(link_name = "PQntuples")
    ntuples :: proc(res: Result) -> Row_Count ---

    // Number of columns in result
    @(link_name = "PQnfields")
    nfields :: proc(res: Result) -> Column_Count ---

    // Get column name by index (0-based)
    @(link_name = "PQfname")
    fname :: proc(res: Result, column_number: Column) -> cstring ---

    // Get column index by name
    // Returns: column index or -1 if not found
    @(link_name = "PQfnumber")
    fnumber :: proc(res: Result, column_name: cstring) -> Column ---

    // Get column type OID
    @(link_name = "PQftype")
    ftype :: proc(res: Result, column_number: Column) -> Oid ---

    // Get column size (-1 for variable length)
    @(link_name = "PQfsize")
    fsize :: proc(res: Result, column_number: Column) -> Field_Size ---

    // Get column format (TEXT or BINARY)
    @(link_name = "PQfformat")
    fformat :: proc(res: Result, column_number: Column) -> Format ---

    // Get field value (null-terminated for text format)
    // Returns pointer to internal storage - do not free
    @(link_name = "PQgetvalue")
    getvalue :: proc(res: Result, row: Row, column: Column) -> [^]u8 ---

    // Get field length in bytes
    @(link_name = "PQgetlength")
    getlength :: proc(res: Result, row: Row, column: Column) -> Field_Length ---

    // Check if field is NULL
    @(link_name = "PQgetisnull")
    getisnull :: proc(res: Result, row: Row, column: Column) -> Is_Null ---

    // Get number of affected rows as string (e.g., "5")
    @(link_name = "PQcmdTuples")
    cmd_tuples :: proc(res: Result) -> cstring ---

    // =========================================================================
    // Escaping
    // =========================================================================

    // Escape string literal (returns malloc'd string, caller must free with freemem)
    @(link_name = "PQescapeLiteral")
    escape_literal :: proc(conn: Conn, str: cstring, length: c.size_t) -> cstring ---

    // Escape identifier (returns malloc'd string, caller must free with freemem)
    @(link_name = "PQescapeIdentifier")
    escape_identifier :: proc(conn: Conn, str: cstring, length: c.size_t) -> cstring ---

    // Free memory allocated by libpq (e.g., from escape functions)
    @(link_name = "PQfreemem")
    freemem :: proc(ptr: rawptr) ---

    // =========================================================================
    // NOTIFY support
    // =========================================================================

    // Check for NOTIFY messages
    // Returns: pointer to Notify struct, or nil if none pending
    // Caller must free with freemem
    @(link_name = "PQnotifies")
    notifies :: proc(conn: Conn) -> ^Notify ---
}

// NOTIFY message structure
Notify :: struct {
    relname: cstring,     // Notification channel name
    be_pid:  Backend_PID, // Notifying backend's PID
    extra:   cstring,     // Notification payload string
}

// =============================================================================
// Error Field Codes (for result_error_field)
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
// Helper Functions
// =============================================================================

// Get field value as Odin string (empty string if NULL)
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

// Check if connection is OK
is_connected :: proc(conn: Conn) -> bool {
    return conn != nil && status(conn) == .OK
}

// Check if result indicates success (has data or command completed)
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

// Check if socket is valid
is_valid_socket :: proc(sock: Socket) -> bool {
    return sock >= Socket(0)
}

// Iterate over all rows and columns in a result
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

// Get next cell value, returns false when done
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

// Iterate rows only
iterate_rows :: proc(it: ^Result_Iterator) -> (row: Row, ok: bool) {
    if it.row >= Row(it.n_rows) {
        return 0, false
    }
    row = it.row
    it.row += 1
    return row, true
}
