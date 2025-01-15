import CreatableSelect from 'react-select/creatable';

interface OptionType {
    label: string;
    value: string;
}

type MultiSelectDropdownProps = {
    options: OptionType[];
    selectedOptions: OptionType[];
    onChange: (selected: OptionType[]) => void;
    setSelectedOptions: React.Dispatch<React.SetStateAction<OptionType[]>>;
};


const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ options, selectedOptions, onChange, setSelectedOptions }) => {

    const handleChange = (selected: any) => {
        setSelectedOptions(selected);
        onChange(selected);
    };

    const handleCreate = (inputValue: string) => {
        const newOption = { label: inputValue, value: inputValue };
        setSelectedOptions([...selectedOptions, newOption]);
    };

    return (
        <CreatableSelect
            isMulti
            value={selectedOptions}
            onChange={handleChange}
            options={options}
            onCreateOption={handleCreate}

        />
    );
};

export default MultiSelectDropdown;
