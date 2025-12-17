export default function SelectforOrder({name, id, options, ref, selectlabel}: {name: string, id: string, options: {value: string, name:string}[], ref:any, selectlabel:string}){
    return(
        <div className="w-full flex flex-col gap-3 md:gap-5">
            <label htmlFor={id} className="text-3xl">{selectlabel}</label>
            <select name={name} id={id} ref={ref} className=" text-black text-lg bg-[#eee5e9] sm:rounded-lg px-3 py-2">
                {options.map((option:{value: string, name: string}) => <option className="text-black text-lg" value={option.value}>{option.name}</option>)}
            </select>
        </div>
    );
}