#!/bin/bash

# API Test Script for Webshop Backend
# Tests all endpoints with proper authentication
# Admin creates products first, then user orders them

# IMPORTANT: Do NOT use set -e - we handle errors manually
# set -e

# Colors for pretty printing
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:3000"

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# Storage for tokens and IDs
USER_TOKEN=""
ADMIN_TOKEN=""
TEST_USER_ID=""
TEST_ORDER_ID=""
TEST_PRODUCT_ID=""
TEST_APPOINTMENT_ID=""

# Helper functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ PASS${NC}: $1"
    TESTS_PASSED=$((TESTS_PASSED + 1))
}

print_fail() {
    echo -e "${RED}✗ FAIL${NC}: $1"
    if [ -n "$2" ]; then
        echo -e "${RED}  Error: $2${NC}"
    fi
    TESTS_FAILED=$((TESTS_FAILED + 1))
}

print_info() {
    echo -e "${YELLOW}ℹ INFO${NC}: $1"
}

# Function to make API calls
# Returns: sets global variables HTTP_CODE and RESPONSE_BODY
make_request() {
    local method=$1
    local endpoint="$2"
    local data="$3"
    local token="$4"
    
    # Use an array to properly construct curl command
    local curl_args=(-s -w "\n%{http_code}" -X "$method")
    
    if [ -n "$data" ]; then
        curl_args+=(-H "Content-Type: application/json" -d "$data")
    fi
    
    if [ -n "$token" ]; then
        curl_args+=(-H "Authorization: Bearer $token")
    fi
    
    curl_args+=("$BASE_URL$endpoint")
    
    local full_response=$(curl "${curl_args[@]}" 2>/dev/null)
    HTTP_CODE=$(echo "$full_response" | tail -n1 | tr -d '\r')
    RESPONSE_BODY=$(echo "$full_response" | sed '$d')
}

# Function to check if HTTP code matches expected
check_status() {
    local expected=$1
    if [ "$HTTP_CODE" -eq "$expected" ]; then
        return 0
    else
        return 1
    fi
}

# Function to extract JSON value (handles different response formats)
extract_json_value() {
    local json="$1"
    local key="$2"
    # Try different patterns
    local value=$(echo "$json" | grep -o "\"$key\":\"[^\"]*\"" | head -1 | cut -d'"' -f4)
    if [ -z "$value" ]; then
        value=$(echo "$json" | grep -o "\"$key\":[0-9]*" | head -1 | cut -d':' -f2)
    fi
    echo "$value"
}

# ==================== PHASE 1: SETUP - Create Admin Resources ====================
print_header "PHASE 1: ADMIN SETUP - Creating Resources"

# Test 1: Admin Login
print_header "TEST 1: Admin Login"

make_request "POST" "/api/login" \
    '{"username":"admin","password":"admin123"}' \
    ""

if check_status 200; then
    print_success "Admin login"
    ADMIN_TOKEN=$(extract_json_value "$RESPONSE_BODY" "token")
    print_info "Got admin token: ${ADMIN_TOKEN:0:30}..."
else
    print_fail "Admin login" "HTTP $HTTP_CODE: $RESPONSE_BODY"
    exit 1
fi

# Test 2: Admin - Create a Product
print_header "TEST 2: Admin - Create Product"

# Simple base64 image (1x1 pixel PNG) - must be in data URL format
SIMPLE_IMAGE="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

make_request "POST" "/api/product" \
    "{\"name\":\"Test Product $(date +%s)\",\"category\":\"Electronics\",\"maker\":\"TestMaker\",\"description\":\"A test product created by API test\",\"price\":999,\"stock_number\":100,\"image\":\"$SIMPLE_IMAGE\"}" \
    "$ADMIN_TOKEN"

if check_status 200; then
    print_success "Admin create product"
    TEST_PRODUCT_ID=$(extract_json_value "$RESPONSE_BODY" "id")
    print_info "Created product ID: $TEST_PRODUCT_ID"
else
    print_fail "Admin create product" "HTTP $HTTP_CODE: $RESPONSE_BODY"
    print_info "Will try to use product ID 1 for further tests"
    TEST_PRODUCT_ID="1"
fi

# Verify we have a product ID
if [ -z "$TEST_PRODUCT_ID" ]; then
    print_info "Product ID is empty, using default: 1"
    TEST_PRODUCT_ID="1"
fi

# Test 3: Admin - Create an Appointment Slot
print_header "TEST 3: Admin - Create Appointment Slot"

# Create an appointment date 7 days from now
appointment_date=$(date -d '+7 days' '+%Y-%m-%dT%H:%M:%S' 2>/dev/null || date -v+7d '+%Y-%m-%dT%H:%M:%S' 2>/dev/null || echo "$(date '+%Y-%m-%dT%H:%M:%S' | sed 's/-/\n/g' | head -1)-$(($(date '+%Y-%m-%dT%H:%M:%S' | sed 's/-/\n/g' | head -2 | tail -1)+7))-$(date '+%Y-%m-%dT%H:%M:%S' | sed 's/-/\n/g' | tail -1)")

make_request "POST" "/api/newappointment" \
    "{\"appointmentDate\":\"$appointment_date\"}" \
    "$ADMIN_TOKEN"

if check_status 200; then
    print_success "Admin create appointment"
    TEST_APPOINTMENT_ID=$(extract_json_value "$RESPONSE_BODY" "id")
    print_info "Created appointment ID: $TEST_APPOINTMENT_ID"
else
    print_fail "Admin create appointment" "HTTP $HTTP_CODE: $RESPONSE_BODY"
    print_info "Appointment creation failed but continuing tests"
fi

# ==================== PHASE 2: USER OPERATIONS ====================
print_header "PHASE 2: USER OPERATIONS"

# Test 4: Register a new user
print_header "TEST 4: User Registration"

test_username="testuser_$(date +%s)"
test_password="TestPass123!"
test_email="test_$(date +%s)@example.com"

make_request "POST" "/api/signup" \
    "{\"username\":\"$test_username\",\"password\":\"$test_password\",\"confirmPassword\":\"$test_password\",\"email\":\"$test_email\"}" \
    ""

if check_status 200; then
    print_success "User registration"
    USER_TOKEN=$(extract_json_value "$RESPONSE_BODY" "token")
    print_info "Got user token: ${USER_TOKEN:0:30}..."
else
    print_fail "User registration" "HTTP $HTTP_CODE: $RESPONSE_BODY"
fi

# Test 5: User Login
print_header "TEST 5: User Login"

make_request "POST" "/api/login" \
    "{\"username\":\"$test_username\",\"password\":\"$test_password\"}" \
    ""

if check_status 200; then
    print_success "User login"
    USER_TOKEN=$(extract_json_value "$RESPONSE_BODY" "token")
else
    print_fail "User login" "HTTP $HTTP_CODE: $RESPONSE_BODY"
fi

# Test 6: Get User Profile
print_header "TEST 6: Get User Profile"

make_request "GET" "/api/user" "" "$USER_TOKEN"

if check_status 200; then
    print_success "Get user profile"
    TEST_USER_ID=$(extract_json_value "$RESPONSE_BODY" "id")
    print_info "User ID: $TEST_USER_ID"
else
    print_fail "Get user profile" "HTTP $HTTP_CODE: $RESPONSE_BODY"
fi

# Verify user ID
if [ -z "$TEST_USER_ID" ]; then
    print_info "User ID is empty, using default: 1"
    TEST_USER_ID="1"
fi

# Test 7: Get Products (Public) - Should see admin-created product
print_header "TEST 7: Get Products (Public)"

# URL encode the & character properly
make_request "GET" "/api/products?limit=5%26offset=0" "" ""

if check_status 200; then
    print_success "Get products list"
    product_count=$(echo "$RESPONSE_BODY" | grep -o '"id"' | wc -l)
    print_info "Products found: $product_count"
else
    print_fail "Get products list" "HTTP $HTTP_CODE: $RESPONSE_BODY"
fi

# Test 8: Get Single Product
print_header "TEST 8: Get Single Product"

make_request "GET" "/api/product?id=$TEST_PRODUCT_ID" "" ""

if check_status 200; then
    print_success "Get single product"
    product_name=$(extract_json_value "$RESPONSE_BODY" "name")
    print_info "Product name: $product_name"
else
    print_fail "Get single product" "HTTP $HTTP_CODE: $RESPONSE_BODY"
fi

# Test 9: Create Order (as user) - Using admin-created product
print_header "TEST 9: Create Order"

order_data="{\"u_id\":$TEST_USER_ID,\"deliveryAddr\":{\"zipCode\":\"1234\",\"cityName\":\"TestCity\",\"streetName\":\"TestStreet\",\"houseNumber\":\"42\"},\"billingAddr\":{\"zipCode\":\"1234\",\"cityName\":\"TestCity\",\"streetName\":\"TestStreet\",\"houseNumber\":\"42\"},\"pMethod\":\"card\",\"dMethod\":\"courier\",\"total_amount\":1998,\"products\":[{\"id\":\"$TEST_PRODUCT_ID\",\"price\":\"999\",\"amount\":2}]}"

make_request "POST" "/api/order" "$order_data" "$USER_TOKEN"

if check_status 200; then
    print_success "Create order"
    TEST_ORDER_ID=$(extract_json_value "$RESPONSE_BODY" "id")
    print_info "Created order ID: $TEST_ORDER_ID"
else
    print_fail "Create order" "HTTP $HTTP_CODE: $RESPONSE_BODY"
fi

# Test 10: Get Free Appointments (as user) - Should see admin-created appointment
print_header "TEST 10: Get Free Appointments"

make_request "GET" "/api/freeappointments" "" "$USER_TOKEN"

if check_status 200; then
    print_success "Get free appointments"
    appointment_count=$(echo "$RESPONSE_BODY" | grep -o '"id"' | wc -l)
    print_info "Available appointments: $appointment_count"
else
    print_fail "Get free appointments" "HTTP $HTTP_CODE: $RESPONSE_BODY"
fi

# ==================== PHASE 3: ADMIN MANAGEMENT ====================
print_header "PHASE 3: ADMIN MANAGEMENT OPERATIONS"

# Test 11: Admin - Get All Products (should include created product)
print_header "TEST 11: Admin - Get All Products"

make_request "GET" "/api/admin/products" "" "$ADMIN_TOKEN"

if check_status 200; then
    print_success "Admin get all products"
    product_count=$(echo "$RESPONSE_BODY" | grep -o '"id"' | wc -l)
    print_info "Total products: $product_count"
else
    print_fail "Admin get all products" "HTTP $HTTP_CODE: $RESPONSE_BODY"
fi

# Test 12: Admin - Get All Orders (should include user order)
print_header "TEST 12: Admin - Get All Orders"

make_request "GET" "/api/admin/orders" "" "$ADMIN_TOKEN"

if check_status 200; then
    print_success "Admin get all orders"
    order_count=$(echo "$RESPONSE_BODY" | grep -o '"id"' | wc -l)
    print_info "Total orders: $order_count"
else
    print_fail "Admin get all orders" "HTTP $HTTP_CODE: $RESPONSE_BODY"
fi

# Test 13: Admin - Get All Appointments
print_header "TEST 13: Admin - Get All Appointments"

make_request "GET" "/api/admin/appointments" "" "$ADMIN_TOKEN"

if check_status 200; then
    print_success "Admin get all appointments"
    appointment_count=$(echo "$RESPONSE_BODY" | grep -o '"id"' | wc -l)
    print_info "Total appointments: $appointment_count"
else
    print_fail "Admin get all appointments" "HTTP $HTTP_CODE: $RESPONSE_BODY"
fi

# Test 14: Admin - Get All Users
print_header "TEST 14: Admin - Get All Users"

make_request "GET" "/api/admin/users" "" "$ADMIN_TOKEN"

if check_status 200; then
    print_success "Admin get all users"
    user_count=$(echo "$RESPONSE_BODY" | grep -o '"id"' | wc -l)
    print_info "Total users: $user_count"
else
    print_fail "Admin get all users" "HTTP $HTTP_CODE: $RESPONSE_BODY"
fi

# ==================== PHASE 4: CLEANUP ====================
print_header "PHASE 4: CLEANUP"

# Test 15: User Logout
print_header "TEST 15: User Logout"

make_request "POST" "/api/logout" "" "$USER_TOKEN"

if check_status 200; then
    print_success "User logout"
else
    print_fail "User logout" "HTTP $HTTP_CODE: $RESPONSE_BODY"
fi

# Test 16: Admin Logout
print_header "TEST 16: Admin Logout"

make_request "POST" "/api/logout" "" "$ADMIN_TOKEN"

if check_status 200; then
    print_success "Admin logout"
else
    print_fail "Admin logout" "HTTP $HTTP_CODE: $RESPONSE_BODY"
fi

# Test 17: Access Denied - Non-admin trying admin endpoint
print_header "TEST 17: Access Control Test"

make_request "GET" "/api/admin/users" "" "$USER_TOKEN"

if check_status 403 || check_status 401; then
    print_success "Access control working (token/user rejected from admin endpoint)"
else
    print_fail "Access control test" "Expected 401/403, got HTTP $HTTP_CODE"
fi

# Summary
print_header "TEST SUMMARY"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo -e "${BLUE}Total:  $((TESTS_PASSED + TESTS_FAILED))${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  Some tests failed!${NC}"
    exit 1
fi
