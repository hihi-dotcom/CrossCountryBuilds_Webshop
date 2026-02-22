export default function SelectforOrder({name, id, options,  selectlabel, onChange}: {name: string, id: string, options: {value: string, name:string, innerText:string, disabled: boolean}[], onChange:(param1:any) => void, selectlabel:string}){
    return(
        <div className="w-full flex flex-col gap-3 md:gap-5">
            <label htmlFor={id} className="text-3xl">{selectlabel}</label>
            <select onChange={onChange} name={name} id={id}className=" md:text-black border-2 md:border-transparent rounded-lg text-lg bg-transparent sm:rounded-lg px-3 py-2 md:bg-amber-50 dark-select">
                {options.map((option:{value: string, name: string, innerText:string, disabled:boolean}) => <option className="text-black text-lg" value={option.value} disabled={option.disabled}>{option.innerText}</option>)}
            </select>
        </div>
    );
}