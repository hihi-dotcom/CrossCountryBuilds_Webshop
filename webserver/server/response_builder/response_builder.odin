package response_builder

Response :: struct {
    status_line: Status_Line,
    options: map[string]string    
}

Status_Line :: struct {
    protocol: string,
    status: string,
    reason: string
}

Build :: proc() {

}