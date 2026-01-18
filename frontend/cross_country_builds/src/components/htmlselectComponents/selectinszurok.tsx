export default function KategoriakSelect({options, ref, OnChange}: {options: {value: string, name: string}[], ref:any,  OnChange: () => void}){
    return(
        <>
            
            <select name="category" id="kategoriak" onChange={OnChange} className="bg-amber-50 text-black rounded-lg h-9 w-full text-xl" ref={ref}>
                <option value="" disabled selected className="text-xl">Válassz kategóriát...</option>
                {options.map((option: {value: string, name: string}) => <option value={option.value}>{option.name}</option>)}
            </select>
        </>

    )
}