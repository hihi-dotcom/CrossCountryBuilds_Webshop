export default interface TextInputProps{
    inp_type: string
    inp_name: string,
    inp_id: string,
    ref: any,
    inp_placeholder: string,
    inp_className: string,
    OnChange: () => void
}