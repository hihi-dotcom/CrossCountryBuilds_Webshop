export default function KategoriakSelect({options, ref}: {options: {value: string, name: string}[], ref:any}){
    return(
        <>
            
            <select name="kategoriak" id="kategoriak" className="bg-amber-50 text-black rounded-lg h-9 w-full" ref={ref}>
                <option value="" disabled selected>Válassz kategóriát...</option>
                {options.map((option: {value: string, name: string}) => <option value={option.value}>{option.name}</option>)}
            </select>
        </>

    )
}