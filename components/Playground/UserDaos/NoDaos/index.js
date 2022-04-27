import React from 'react'

const NoDaos = () => {
  return (
    <div className="flex w-full flex-col lg:w-2/5">
      <div className="text-3xl h-10 px-3">no daos found</div>
      <div className="grid grid-cols-2 h-56 bg-slate-200 dark:bg-slate-800 rounded-xl justify-center items-center m-3">
        <div className="text-xl text-center">No daos found</div>
        <button className="text-xl bg-slate-300 dark:bg-slate-700 rounded-lg space-x-2 mx-3 h-16 hover:border-teal-300 dark:hover:border-teal-300 border border-slate-100 dark:border-slate-700 font-bold"><span>create dao</span></button>
      </div>
    </div>
  )
}

export default NoDaos