// Example usage of libpq non-blocking bindings for Odin
// Demonstrates async connection, queries, and result handling
package test

import "core:fmt"
import "core:time"
import "core:c"
import pq "../pq" // Adjust import path as needed

// Platform-specific imports for socket polling
when ODIN_OS == .Windows {
    foreign import winsock "system:Ws2_32.lib"
} else {
    foreign import libc "system:c"
}

// =============================================================================
// Example 1: Basic Non-blocking Connection
// =============================================================================

connect_async :: proc(conninfo: cstring) -> (pq.Conn, bool) {
    // Start async connection
    conn := pq.connect_start(conninfo)
    if conn == nil {
        fmt.eprintln("Failed to allocate connection")
        return nil, false
    }
    
    // Check if connection failed immediately
    if pq.status(conn) == .BAD {
        fmt.eprintln("Connection failed:", pq.error_message(conn))
        pq.finish(conn)
        return nil, false
    }
    
    // Poll until connection completes
    for {
        poll_status := pq.connect_poll(conn)
        
        switch poll_status {
        case .OK:
            fmt.println("Connected successfully!")
            fmt.println("  Database:", pq.db(conn))
            fmt.println("  User:", pq.user(conn))
            fmt.println("  Host:", pq.host(conn))
            fmt.println("  Port:", pq.port(conn))
            return conn, true
            
        case .FAILED:
            fmt.eprintln("Connection failed:", pq.error_message(conn))
            pq.finish(conn)
            return nil, false
            
        case .READING:
            // Wait for socket to be readable
            if !wait_for_socket(pq.socket(conn), for_read = true) {
                fmt.eprintln("Socket wait failed")
                pq.finish(conn)
                return nil, false
            }
            
        case .WRITING:
            // Wait for socket to be writable
            if !wait_for_socket(pq.socket(conn), for_read = false) {
                fmt.eprintln("Socket wait failed")
                pq.finish(conn)
                return nil, false
            }
        }
    }
}

// =============================================================================
// Example 2: Non-blocking Query Execution
// =============================================================================

execute_query_async :: proc(conn: pq.Conn, query: cstring) -> (pq.Result, bool) {
    // Enable non-blocking mode
    if pq.set_nonblocking(conn, .NON_BLOCKING) == .FAILURE {
        fmt.eprintln("Failed to set non-blocking mode")
        return nil, false
    }
    
    // Send query
    if pq.send_query(conn, query) == .FAILURE {
        fmt.eprintln("Failed to send query:", pq.error_message(conn))
        return nil, false
    }
    
    // Flush output buffer
    for {
        flush_result := pq.flush(conn)
        switch flush_result {
        case .OK:
            break // All data sent
        case .ERROR:
            fmt.eprintln("Flush failed:", pq.error_message(conn))
            return nil, false
        case .WOULD_BLOCK:
            // Wait for socket to be writable, then retry
            if !wait_for_socket(pq.socket(conn), for_read = false) {
                return nil, false
            }
            continue
        }
        break
    }
    
    // Wait for and collect results
    final_result: pq.Result = nil
    
    for {
        // Wait for socket to be readable
        if !wait_for_socket(pq.socket(conn), for_read = true) {
            return nil, false
        }
        
        // Consume available input
        if pq.consume_input(conn) == .FAILURE {
            fmt.eprintln("consume_input failed:", pq.error_message(conn))
            return nil, false
        }
        
        // Check if result is ready
        if pq.is_busy(conn) == .SUCCESS {
            // Still busy, wait more
            continue
        }
        
        // Get result (may need multiple calls for multiple results)
        for {
            res := pq.get_result(conn)
            if res == nil {
                // No more results
                break
            }
            
            // Clear previous result if any
            if final_result != nil {
                pq.clear(final_result)
            }
            final_result = res
        }
        
        break
    }
    
    return final_result, final_result != nil
}

// =============================================================================
// Example 3: Parameterized Query
// =============================================================================

execute_parameterized_query :: proc(conn: pq.Conn) -> bool {
    // Example: SELECT * FROM users WHERE id = $1 AND status = $2
    query := cstring("SELECT $1::int + $2::int AS sum")
    
    // Parameter values (as strings for text format)
    param_values := [?]cstring{"10", "20"}
    
    if pq.send_query_params(
        conn,
        query,
        pq.Param_Count(len(param_values)),
        nil,  // Let server infer types
        raw_data(&param_values),
        nil,  // Null-terminated strings, no lengths needed
        nil,  // All text format
        .TEXT, // Result in text format
    ) == .FAILURE {
        fmt.eprintln("Failed to send parameterized query:", pq.error_message(conn))
        return false
    }
    
    // Flush and wait for result (simplified - blocks)
    pq.flush(conn)
    
    res := pq.get_result(conn)
    defer if res != nil { pq.clear(res) }
    
    // Consume remaining results
    for {
        r := pq.get_result(conn)
        if r == nil do break
        pq.clear(r)
    }
    
    if res == nil {
        fmt.eprintln("No result returned")
        return false
    }
    
    if !pq.is_success(res) {
        fmt.eprintln("Query failed:", pq.result_error_message(res))
        return false
    }
    
    // Print result
    fmt.println("Parameterized query result:")
    print_result(res)
    
    return true
}

// =============================================================================
// Example 4: Prepared Statements
// =============================================================================

use_prepared_statement :: proc(conn: pq.Conn) -> bool {
    stmt_name := cstring("my_prepared_stmt")
    
    // Prepare the statement
    if pq.send_prepare(
        conn,
        stmt_name,
        "SELECT $1::text || ' ' || $2::text AS greeting",
        pq.Param_Count(2),
        nil, // Let server infer types
    ) == .FAILURE {
        fmt.eprintln("Failed to send prepare:", pq.error_message(conn))
        return false
    }
    
    // Wait for prepare result
    pq.flush(conn)
    res := pq.get_result(conn)
    if res != nil {
        if pq.result_status(res) != .COMMAND_OK {
            fmt.eprintln("Prepare failed:", pq.result_error_message(res))
            pq.clear(res)
            return false
        }
        pq.clear(res)
    }
    // Consume any extra results
    for { r := pq.get_result(conn); if r == nil do break; pq.clear(r) }
    
    fmt.println("Statement prepared successfully")
    
    // Execute prepared statement with parameters
    params := [?]cstring{"Hello", "World"}
    
    if pq.send_query_prepared(
        conn,
        stmt_name,
        pq.Param_Count(len(params)),
        raw_data(&params),
        nil,
        nil,
        .TEXT,
    ) == .FAILURE {
        fmt.eprintln("Failed to execute prepared statement:", pq.error_message(conn))
        return false
    }
    
    pq.flush(conn)
    res = pq.get_result(conn)
    defer if res != nil { pq.clear(res) }
    for { r := pq.get_result(conn); if r == nil do break; pq.clear(r) }
    
    if res == nil || !pq.is_success(res) {
        fmt.eprintln("Prepared statement execution failed")
        return false
    }
    
    fmt.println("Prepared statement result:")
    print_result(res)
    
    return true
}

// =============================================================================
// Example 5: Result Iteration
// =============================================================================

print_result :: proc(res: pq.Result) {
    n_rows := pq.ntuples(res)
    n_cols := pq.nfields(res)
    
    fmt.printf("Result: %d rows, %d columns\n", n_rows, n_cols)
    
    // Print column headers
    fmt.print("| ")
    for col in 0..<i32(n_cols) {
        name := pq.fname(res, pq.Column(col))
        fmt.printf("%-15s | ", name)
    }
    fmt.println()
    
    // Print separator
    for _ in 0..<i32(n_cols) + 1 {
        fmt.print("-----------------")
    }
    fmt.println()
    
    // Print rows
    for row in 0..<i32(n_rows) {
        fmt.print("| ")
        for col in 0..<i32(n_cols) {
            r := pq.Row(row)
            c := pq.Column(col)
            
            if pq.getisnull(res, r, c) == .NULL {
                fmt.printf("%-15s | ", "<NULL>")
            } else {
                value := pq.get_value_string(res, r, c)
                fmt.printf("%-15s | ", value)
            }
        }
        fmt.println()
    }
}

// Using the iterator helper
print_result_with_iterator :: proc(res: pq.Result) {
    fmt.println("Using iterator:")
    
    it := pq.make_result_iterator(res)
    current_row := pq.Row(-1)
    
    for {
        value, row, col, ok := pq.iterate_cells(&it)
        if !ok do break
        
        if row != current_row {
            if current_row >= 0 do fmt.println()
            current_row = row
            fmt.printf("Row %d: ", row)
        }
        
        col_name := pq.fname(res, col)
        fmt.printf("%s=%s  ", col_name, value)
    }
    fmt.println()
}

// =============================================================================
// Example 6: Error Handling
// =============================================================================

demonstrate_error_handling :: proc(conn: pq.Conn) {
    // Execute an invalid query
    if pq.send_query(conn, "SELECT * FROM nonexistent_table_xyz") == .FAILURE {
        fmt.eprintln("Failed to send query:", pq.error_message(conn))
        return
    }
    
    pq.flush(conn)
    res := pq.get_result(conn)
    defer if res != nil { pq.clear(res) }
    for { r := pq.get_result(conn); if r == nil do break; pq.clear(r) }
    
    if res == nil {
        return
    }
    
    status := pq.result_status(res)
    fmt.println("Result status:", status)
    
    if status == .FATAL_ERROR {
        fmt.println("Error details:")
        fmt.println("  Message:", pq.result_error_message(res))
        
        // Get specific error fields
        if sqlstate := pq.result_error_field(res, .SQLSTATE); sqlstate != nil {
            fmt.println("  SQLSTATE:", sqlstate)
        }
        if hint := pq.result_error_field(res, .MESSAGE_HINT); hint != nil {
            fmt.println("  Hint:", hint)
        }
        if detail := pq.result_error_field(res, .MESSAGE_DETAIL); detail != nil {
            fmt.println("  Detail:", detail)
        }
    }
}

// =============================================================================
// Example 7: LISTEN/NOTIFY (Async Notifications)
// =============================================================================

listen_for_notifications :: proc(conn: pq.Conn, channel: cstring, timeout_seconds: int) {
    // Start listening
    listen_cmd := fmt.ctprintf("LISTEN %s", channel)
    if pq.send_query(conn, listen_cmd) == .FAILURE {
        fmt.eprintln("LISTEN failed:", pq.error_message(conn))
        return
    }
    
    pq.flush(conn)
    res := pq.get_result(conn)
    if res != nil { pq.clear(res) }
    for { r := pq.get_result(conn); if r == nil do break; pq.clear(r) }
    
    fmt.printf("Listening on channel '%s' for %d seconds...\n", channel, timeout_seconds)
    
    start := time.now()
    for {
        elapsed := time.duration_seconds(time.since(start))
        if elapsed >= f64(timeout_seconds) {
            fmt.println("Timeout reached")
            break
        }
        
        // Wait for socket with timeout
        if !wait_for_socket_timeout(pq.socket(conn), 1) { // 1 second timeout
            continue
        }
        
        // Consume input
        if pq.consume_input(conn) == .FAILURE {
            fmt.eprintln("consume_input failed:", pq.error_message(conn))
            break
        }
        
        // Check for notifications
        for {
            notify := pq.notifies(conn)
            if notify == nil do break
            
            fmt.printf("NOTIFY received: channel='%s', payload='%s', pid=%d\n",
                notify.relname, notify.extra, notify.be_pid)
            
            pq.freemem(notify)
        }
    }
}

// =============================================================================
// Helper: Wait for Socket (Cross-platform)
// =============================================================================

// timeval struct for select()
Timeval :: struct {
    tv_sec:  c.long,
    tv_usec: c.long,
}

// fd_set for select() - simplified, assumes socket fd < 64
FD_Set :: struct {
    fds_bits: [1]c.ulong, // Simplified - works for single fd < 64
}

fd_set_set :: proc(fd: pq.Socket, set: ^FD_Set) {
    if fd >= 0 && fd < 64 {
        set.fds_bits[0] |= c.ulong(1) << c.uint(fd)
    }
}

fd_set_zero :: proc(set: ^FD_Set) {
    set.fds_bits[0] = 0
}

fd_set_isset :: proc(fd: pq.Socket, set: ^FD_Set) -> bool {
    if fd >= 0 && fd < 64 {
        return (set.fds_bits[0] & (c.ulong(1) << c.uint(fd))) != 0
    }
    return false
}

when ODIN_OS == .Windows {
    @(default_calling_convention = "std")
    foreign winsock {
        @(link_name = "select")
        select :: proc(nfds: c.int, readfds: ^FD_Set, writefds: ^FD_Set, exceptfds: ^FD_Set, timeout: ^Timeval) -> c.int ---
    }
} else {
    @(default_calling_convention = "c")
    foreign libc {
        select :: proc(nfds: c.int, readfds: ^FD_Set, writefds: ^FD_Set, exceptfds: ^FD_Set, timeout: ^Timeval) -> c.int ---
    }
}

wait_for_socket :: proc(sock: pq.Socket, for_read: bool, timeout_ms: i32 = -1) -> bool {
    if !pq.is_valid_socket(sock) {
        return false
    }
    
    read_set, write_set: FD_Set
    fd_set_zero(&read_set)
    fd_set_zero(&write_set)
    
    if for_read {
        fd_set_set(sock, &read_set)
    } else {
        fd_set_set(sock, &write_set)
    }
    
    timeout: Timeval
    timeout_ptr: ^Timeval = nil
    
    if timeout_ms >= 0 {
        timeout.tv_sec = c.long(timeout_ms / 1000)
        timeout.tv_usec = c.long((timeout_ms % 1000) * 1000)
        timeout_ptr = &timeout
    }
    
    result := select(
        c.int(sock) + 1,
        for_read ? &read_set : nil,
        for_read ? nil : &write_set,
        nil,
        timeout_ptr,
    )
    
    return result > 0
}

wait_for_socket_timeout :: proc(sock: pq.Socket, timeout_seconds: int) -> bool {
    return wait_for_socket(sock, for_read = true, timeout_ms = i32(timeout_seconds * 1000))
}

// =============================================================================
// Main: Run Examples
// =============================================================================

print_separator :: proc(char: string = "=", count: int = 60) {
    for _ in 0..<count {
        fmt.print(char)
    }
    fmt.println()
}

example_main :: proc() {
    // Connection string - adjust for your setup
    // Format: "host=localhost port=5432 dbname=testdb user=postgres password=secret"
    conninfo := cstring("host=localhost dbname=postgres")
    
    print_separator()
    fmt.println("libpq Non-blocking Example")
    print_separator()
    
    // Example 1: Connect
    fmt.println("\n--- Example 1: Async Connection ---")
    conn, ok := connect_async(conninfo)
    if !ok {
        fmt.eprintln("Could not connect to database")
        return
    }
    defer pq.finish(conn)
    
    // Example 2: Simple query
    fmt.println("\n--- Example 2: Simple Async Query ---")
    res, ok2 := execute_query_async(conn, "SELECT version()")
    if ok2 && res != nil {
        print_result(res)
        pq.clear(res)
    }
    
    // Example 3: Query with data
    fmt.println("\n--- Example 3: Query with Multiple Rows ---")
    res2, ok3 := execute_query_async(conn, 
        "SELECT 1 AS id, 'Alice' AS name UNION ALL SELECT 2, 'Bob' UNION ALL SELECT 3, 'Charlie'")
    if ok3 && res2 != nil {
        print_result(res2)
        fmt.println()
        print_result_with_iterator(res2)
        pq.clear(res2)
    }
    
    // Example 4: Parameterized query
    fmt.println("\n--- Example 4: Parameterized Query ---")
    execute_parameterized_query(conn)
    
    // Example 5: Prepared statement
    fmt.println("\n--- Example 5: Prepared Statement ---")
    use_prepared_statement(conn)
    
    // Example 6: Error handling
    fmt.println("\n--- Example 6: Error Handling ---")
    demonstrate_error_handling(conn)
    
    // Example 7: NOTIFY (uncomment to test - requires another connection to send NOTIFY)
    // fmt.println("\n--- Example 7: LISTEN/NOTIFY ---")
    // listen_for_notifications(conn, "test_channel", 5)
    
    fmt.println()
    print_separator()
    fmt.println("Examples complete!")
    print_separator()
}
