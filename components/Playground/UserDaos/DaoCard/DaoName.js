import useForm                      from 'hooks/useForm'
import * as api                     from 'query'
import React, {useEffect, useState} from 'react'
import {HiCheckCircle, HiPencilAlt} from 'react-icons/hi'
import {useMutation, useQuery}      from 'react-query'
import {walletSnippet}              from 'utils/helpers'

const DaoName = ({safe, isMember}) => {
    const [isEditable, setIsEditable] = useState(false)
    const {state, setState, handleChange} = useForm()
    const {mutateAsync} = useMutation(api.updateDao, {
        refetchActive: true,
    })
    const {data} = useQuery(
        [`${safe}`],
        () => api.getDao({address: safe}),
        {staleTime: 180000}
    )
    const handleFocus = (e) => {
        e.target.select();
    }
    const handleSave = () => {
        setIsEditable(flag => !flag)
        const shouldSave = !!state.name && data.name !== state.name
        if (isEditable && shouldSave) {
            mutateAsync({id: data.id, name: state.name})
        }
    }

    useEffect(() => {
        if (!!data?.name)
            setState({name: data.name})

    }, [data])

    return (
        <div className="flex flex-row items-center space-x-3">
            <div className="text-2xl">
                <form
                    className="flex w-full flex-col space-y-8 py-4"
                >
                    <input
                        value={state?.name === undefined ? walletSnippet(safe) : state.name}
                        onChange={(handleChange)}
                        onFocus={handleFocus}
                        name={"name"}
                        className={`focus:outline-0 bg-slate-${isEditable ? '300' : '200'} dark:bg-slate-${isEditable ? '900' : '800'} font-bold rounded-xl p-4 ${isEditable ? 'shadow-inner' : ''}`}
                        disabled={!isEditable}
                    />
                </form>
            </div>
            {isMember ? (
                <button
                    onClick={(e) => handleSave(e)}
                    className="flex flex-col items-center justify-center w-full text-center text-sm border hover:text-teal-300 hover:border-white dark:hover:border-white border-slate-100 dark:border-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500 rounded-lg p-1">
                    {isEditable ? <HiCheckCircle size={18}/> : <HiPencilAlt size={18}/>}
                </button>
            ) : null}
        </div>
    )
}

export default DaoName
