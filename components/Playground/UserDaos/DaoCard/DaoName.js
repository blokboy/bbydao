import React, {useState}            from "react"
import {HiCheckCircle, HiPencilAlt} from "react-icons/hi"
import {walletSnippet}              from 'utils/helpers'
import useForm         from '../../../../hooks/useForm'
import Modal           from '../../../Layout/Modal'

const DaoName = ({safe, isMember}) => {
    const {state, setState, handleChange} = useForm()

    const handleFocus = (e) => {
        e.target.select();
    }

    const handleSubmit = (e) => {
        console.log('e', e)
    }
    const [isEditable, setIsEditable] = useState(false)

    console.log('state', state.name)


    return (
        <div className="flex flex-row items-center space-x-3">
            <div className="text-2xl">
                <form
                    className="flex w-full flex-col space-y-8 py-4"
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <input
                        value={state?.name || walletSnippet(safe)}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        name={"name"}
                        className={`focus:outline-0 bg-transparent ${isEditable ? 'border-b' : ''}`}
                        disabled={!isEditable}
                    />
                </form>
                {/*{walletSnippet(safe)}*/}
            </div>
            {isMember ? (
                <button
                    onClick={(e) => {
                       // this.select()
                        console.log('e', e)
                        setIsEditable(flag => !flag)
                        if(isEditable) {
                            console.log('are editing')
                        }
                    }}
                    className="flex flex-col items-center justify-center w-full text-center text-sm border hover:text-teal-300 hover:border-white dark:hover:border-white border-slate-100 dark:border-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500 rounded-lg p-1">
                    {isEditable ?  <HiCheckCircle size={18} /> : <HiPencilAlt size={18}/>}


                </button>
            ) : null}
        </div>
    )
}

export default DaoName
