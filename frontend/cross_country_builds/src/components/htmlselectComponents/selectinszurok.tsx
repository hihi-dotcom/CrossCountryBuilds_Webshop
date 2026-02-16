export default function KategoriakSelect({options}: {options: {value: string, name: string}[]}){
    return(
        <>
            
            <select name="category" id="kategoriak"  className="md:bg-amber-50 md:text-black rounded-lg h-9 w-full text-xl bg-transparent border-2 border-white " >
                <option value="" disabled selected className="text-xl">Válassz kategóriát...</option>
                {options.map((option: {value: string, name: string}) => <option className="text-black" value={option.value}>{option.name}</option>)}
            </select>
        </>

    )
}