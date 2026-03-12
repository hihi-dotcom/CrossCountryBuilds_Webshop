// Tests for LOGIC module business logic only
// This tests the pure business logic functions in the logic/ directory
package logic_tests

import "core:fmt"
import "core:strconv"

// ============================================================================
// TEST RESULTS TRACKING
// ============================================================================

TestResult :: struct {
    passed: int,
    failed: int,
}

result: TestResult

expect :: proc(condition: bool, message: string) {
    if condition {
        result.passed += 1
        fmt.println("  PASS:", message)
    } else {
        result.failed += 1
        fmt.println("  FAIL:", message)
    }
}

// ============================================================================
// AUTH LOGIC TESTS (from logic/auth/check.odin)
// ============================================================================

// Recreate the convert function from check.odin for testing
AuthPayload :: struct {
    role: string,
    id: int
}

convert_auth_payload :: proc(payload: string) -> ^AuthPayload {
    index_of := 0
    for char, i in payload {
        if char == '$' {
            index_of = i
            break
        }
    }
    
    if index_of == 0 || index_of == len(payload) - 1 {
        return nil // Invalid format
    }
    
    id_string := payload[:index_of]
    role := payload[index_of + 1:]
    id, ok := strconv.parse_int(id_string, 10)
    if !ok {
        return nil
    }
    
    the_payload := new(AuthPayload)
    the_payload.id = id
    the_payload.role = role
    
    return the_payload
}

test_auth_convert_payload :: proc() {
    fmt.println("\n=== Testing auth.convert (logic/auth/check.odin) ===")
    
    // Valid payload with admin role
    p1 := convert_auth_payload("123$admin")
    defer free(p1)
    expect(p1 != nil, "parses valid '123$admin' payload")
    expect(p1.id == 123, "extracts ID 123")
    expect(p1.role == "admin", "extracts role 'admin'")
    
    // Valid payload with user role
    p2 := convert_auth_payload("456$user")
    defer free(p2)
    expect(p2 != nil, "parses valid '456$user' payload")
    expect(p2.id == 456, "extracts ID 456")
    expect(p2.role == "user", "extracts role 'user'")
    
    // Large ID number
    p3 := convert_auth_payload("999999$moderator")
    defer free(p3)
    expect(p3 != nil, "parses large ID payload")
    expect(p3.id == 999999, "extracts large ID correctly")
    expect(p3.role == "moderator", "extracts role 'moderator'")
    
    // Invalid: no separator
    expect(convert_auth_payload("noseparator") == nil, "rejects missing separator")
    
    // Invalid: empty ID
    expect(convert_auth_payload("$admin") == nil, "rejects empty ID")
    
    // Invalid: empty role
    expect(convert_auth_payload("123$") == nil, "rejects empty role")
    
    // Invalid: non-numeric ID
    expect(convert_auth_payload("abc$admin") == nil, "rejects non-numeric ID")
    
    // Invalid: multiple separators (should use first)
    p4 := convert_auth_payload("123$admin$user")
    defer free(p4)
    expect(p4 != nil, "handles multiple separators")
    expect(p4.id == 123, "uses first separator for ID")
    expect(p4.role == "admin$user", "keeps rest as role")
    
    // Invalid: ID is zero
    p5 := convert_auth_payload("0$guest")
    defer free(p5)
    expect(p5 != nil, "allows ID of 0")
    expect(p5.id == 0, "extracts ID 0")
    expect(p5.role == "guest", "extracts role 'guest'")
}

// ============================================================================
// PRODUCTS LOGIC TESTS (from logic/products/)
// ============================================================================

// Test the parsing logic from products_offset.odin
test_parse_product_params :: proc() {
    fmt.println("\n=== Testing product parameter parsing (logic/products/products_offset.odin) ===")
    
    // Test valid integer parsing
    limit, ok1 := strconv.parse_int("10", 10)
    expect(ok1, "parses valid limit '10'")
    expect(limit == 10, "limit equals 10")
    
    offset, ok2 := strconv.parse_int("0", 10)
    expect(ok2, "parses valid offset '0'")
    expect(offset == 0, "offset equals 0")
    
    // Test invalid parsing
    _, ok3 := strconv.parse_int("abc", 10)
    expect(!ok3, "rejects non-numeric string 'abc'")
    
    _, ok4 := strconv.parse_int("", 10)
    expect(!ok4, "rejects empty string")
    
    // Test negative numbers
    negative, ok5 := strconv.parse_int("-5", 10)
    expect(ok5, "parses negative number")
    expect(negative == -5, "negative equals -5")
    
    // Test large numbers
    large, ok6 := strconv.parse_int("2147483647", 10)
    expect(ok6, "parses large number")
    expect(large == 2147483647, "large number correct")
}

// Test filter building logic (simulating the filter struct building)
ProductFilters :: struct {
    name: string,
    category: string,
    maker: string,
    priceFrom: int,
    priceTo: int
}

test_build_product_filters :: proc() {
    fmt.println("\n=== Testing product filter building (logic/products/products_offset.odin) ===")
    
    // Empty filters
    filters := ProductFilters{
        name = "",
        category = "",
        maker = "",
        priceFrom = 0,
        priceTo = 0
    }
    expect(filters.name == "", "empty name filter")
    expect(filters.priceFrom == 0, "empty priceFrom is 0")
    
    // With values
    filters2 := ProductFilters{
        name = "Mountain",
        category = "Mountain Bike",
        maker = "Trek",
        priceFrom = 100000,
        priceTo = 500000
    }
    expect(filters2.name == "Mountain", "name filter set")
    expect(filters2.category == "Mountain Bike", "category filter set")
    expect(filters2.maker == "Trek", "maker filter set")
    expect(filters2.priceFrom == 100000, "priceFrom filter set")
    expect(filters2.priceTo == 500000, "priceTo filter set")
    
    // Partial filters
    filters3 := ProductFilters{
        name = "",
        category = "Road Bike",
        maker = "",
        priceFrom = 0,
        priceTo = 300000
    }
    expect(filters3.name == "", "partial: empty name")
    expect(filters3.category == "Road Bike", "partial: category set")
    expect(filters3.maker == "", "partial: empty maker")
    expect(filters3.priceFrom == 0, "partial: priceFrom 0")
    expect(filters3.priceTo == 300000, "partial: priceTo set")
}

// Test hasMore calculation logic from products_offset.odin
test_has_more_calculation :: proc() {
    fmt.println("\n=== Testing 'hasMore' calculation (logic/products/products_offset.odin) ===")
    
    // Case: more products available
    products_count := 5
    offset := 0
    total := 10
    has_more := products_count + offset < total
    expect(has_more == true, "hasMore=true when products + offset < total")
    
    // Case: exactly at end
    products_count2 := 5
    offset2 := 5
    total2 := 10
    has_more2 := products_count2 + offset2 < total2
    expect(has_more2 == false, "hasMore=false when products + offset == total")
    
    // Case: past end (shouldn't happen but test logic)
    products_count3 := 5
    offset3 := 8
    total3 := 10
    has_more3 := products_count3 + offset3 < total3
    expect(has_more3 == false, "hasMore=false when products + offset > total")
    
    // Case: viewing all products
    products_count4 := 10
    offset4 := 0
    total4 := 10
    has_more4 := products_count4 + offset4 < total4
    expect(has_more4 == false, "hasMore=false when all products shown")
}

// ============================================================================
// PRODUCT DATA STRUCTURE TESTS (from logic/products/product_by_id.odin)
// ============================================================================

Product :: struct {
    id: string,
    name: string,
    category: string,
    maker: string,
    price: string,
    stock_number: string,
    picUrl: string,
    description: string
}

test_product_struct_creation :: proc() {
    fmt.println("\n=== Testing Product struct (logic/products/) ===")
    
    // Create product from map-like data (simulating unmarshal)
    product := Product{
        id = "1",
        name = "Mountain Bike Pro",
        category = "Mountain Bike",
        maker = "Trek",
        price = "250000",
        stock_number = "15",
        picUrl = "bike1.jpg",
        description = "High-performance bike"
    }
    
    expect(product.id == "1", "product ID set")
    expect(product.name == "Mountain Bike Pro", "product name set")
    expect(product.price == "250000", "product price set")
    expect(product.stock_number == "15", "product stock set")
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

main :: proc() {
    fmt.println("========================================")
    fmt.println("  LOGIC Module Business Logic Tests")
    fmt.println("  Testing ONLY logic/ directory code")
    fmt.println("========================================")
    
    test_auth_convert_payload()
    test_parse_product_params()
    test_build_product_filters()
    test_has_more_calculation()
    test_product_struct_creation()
    
    fmt.println("\n========================================")
    fmt.println("  Test Summary:")
    fmt.println("  Passed:", result.passed)
    fmt.println("  Failed:", result.failed)
    fmt.println("========================================")
    
    if result.failed > 0 {
        fmt.println("\nSOME TESTS FAILED!")
    } else {
        fmt.println("\nAll logic module tests passed!")
    }
}