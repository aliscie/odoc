import * as React from 'react';
import {AutocompleteGetTagProps, useAutocomplete} from '@mui/base';
import CloseIcon from '@mui/icons-material/Close';
import {styled} from '@mui/material/styles';
import {autocompleteClasses} from '@mui/material/Autocomplete';

const Root = styled('div')(
    ({theme}) => `
  font-size: 14px;
`,
);

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const InputWrapper = styled('div')(
    ({theme}) => `
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: var(--color);
  }

  &.focused {
    border-color: var(--color);
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
  & input {
    background-color: var(--background-color);
    color: var(--color);
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`,
);

interface TagProps extends ReturnType<AutocompleteGetTagProps> {
    label: string;
}

function Tag(props: TagProps) {
    const {label, onDelete, ...other} = props;
    return (
        <div {...other}>
            <span>{label}</span>
            <CloseIcon onClick={onDelete}/>
        </div>
    );
}

const StyledTag = styled(Tag)<TagProps>(
    ({theme}) => `
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: var(--background-color);
  border: 1px solid var(--color);
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: var(--color);
    background-color: var(--background-color);
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`,
);

const Listbox = styled('ul')(
    ({theme}) => `
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color:var(--background-color);
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

//     & .CheckIcon {
//     color: transparent;
// }
  }

  & li[aria-selected='true'] {
    background-color: var(--background-color);
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }
  
  & li.${autocompleteClasses.focused} {
    background-color: var(--background-color);
    cursor: pointer;
    & svg {
      color: currentColor;
    }
  }
  
`,
);

export default function MultiAutoComplete(props: any) {
    let args = {
        id: 'customized-hook-demo',

        multiple: props.multiple,  // TODO if false value will be a Hashmap instead of an array
        options: props.options,
        getOptionLabel: (option) => option.title,
        onChange: props.onChange,
        value: props.value,
    };

    if (props.defaultValue) {
        args["defaultValue"] = [props.defaultValue];
    }
    ;

    const {
        getRootProps,
        getInputLabelProps,
        getInputProps,
        getTagProps,
        getListboxProps,
        getOptionProps,
        groupedOptions,
        value,
        focused,
        setAnchorEl,
    } = useAutocomplete(args);
    return (
        <Root>
            <div {...getRootProps()}>
                <InputWrapper

                    // style={{
                    //     width: '100px'
                    // }}
                    style={props.style}
                    onChange={props.onChange}
                    ref={setAnchorEl} className={focused ? 'focused' : ''}>
                    {value && props.multiple && value.map((option: FilmOptionType, index: number) => (
                        <StyledTag label={option.title} {...getTagProps({index})} />
                    ))}
                    {value && !props.multiple && <StyledTag label={value.title} {...getTagProps({index: 0})} />}
                    <input placeholder={props.label} {...getInputProps()} onBlur={props.onBlur}/>
                </InputWrapper>
            </div>
            {groupedOptions.length > 0 ? (
                <Listbox {...getListboxProps()}>
                    {(groupedOptions as typeof top100Films).map((option, index) => {

                        try {
                            if (value.find((v: any) => v.title === option.title)) {
                                return null;
                            }
                        } catch (e) {

                        }
                        return (
                            <li {...getOptionProps({option, index})}>
                                <span>{option.title}</span>
                                {/*<CheckIcon  fontSize="small"/>*/}
                            </li>
                        )
                    })}
                </Listbox>
            ) : null}
        </Root>
    );
}

interface FilmOptionType {
    title: string;
    year: number;
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
// const top100Films = [
//     {title: 'The Shawshank Redemption', year: 1994},
//     {title: 'The Godfather', year: 1972},
//     {title: 'The Godfather: Part II', year: 1974},
//
//
// ];