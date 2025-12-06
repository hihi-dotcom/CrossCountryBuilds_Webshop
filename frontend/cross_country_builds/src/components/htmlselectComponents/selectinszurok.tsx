export default function KategoriakSelect({options}: {options: {value: string, name: string}[]}){
    return(
        <>
            
            <select name="kategoriak" id="kategoriak" className="bg-amber-50 text-black rounded-lg h-9 w-full  w-2">
                <option value="" disabled selected>Válassz kategóriát...</option>
                {options.map((option: {value: string, name: string}) => <option value={option.value}>{option.name}</option>)}
            </select>
        </>

    )
}