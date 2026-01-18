export default interface FormFieldProps{
    input_name: string,
    input_id: string,
    type: string,
    input_placeholder: string,
    ref: any,
    onChange: () => void
};