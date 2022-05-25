import React from "react"
import { flatten } from "../../utils/helpers"
import Modal from "../Layout/Modal"
import Earn from "./Bancor/Earn"
import DSR from "./Maker/DSR"

const EarnPortal = ({ tokens }) => {
  const { eth, dai } = tokens

  const earn = React.useMemo(() => {
    if (!eth) return
    return {
      icon: "https://130351921-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FC9gDtGR2KNhur3c7qIJR%2Fuploads%2FZvrb3aQws7FtDYKTJaLp%2FBNT%20Token.png?alt=media&token=ada4053a-d1a7-4e79-a071-38985420d463",
      name: "Bancor",
      modal: <Earn ethToken={flatten(eth)} />,
      subText: "",
      heading: (
        <button type="button" className="flex items-center">
          <div className="mr-4 h-8 w-8 overflow-hidden rounded-full" title="Bancor EarnPortal">
            <img src={"/babydao.png"} />
          </div>
          <div className="flex items-center text-xl font-normal">
            Deposit & Earn <span className="ml-2 pt-[.1rem] text-xs">Bancor v3</span>{" "}
          </div>
        </button>
      ),
    }
  }, [eth])
  const dsr = React.useMemo(() => {
    if (!dai) return

    return {
      icon: "https://cryptologos.cc/logos/maker-mkr-logo.png?v=022",
      name: "Maker",
      modal: <DSR token={flatten(dai)} />,
      subText: "",
      heading: (
        <button type="button" className="flex items-center">
          <div className="mr-4 h-8 w-8 overflow-hidden rounded-full" title="Bancor EarnPortal">
            <img src={"/babydao.png"} />
          </div>
          <div className="flex items-center text-xl font-normal">
            Deposit & Earn <span className="ml-2 pt-[.1rem] text-xs">Maker DAI</span>
          </div>
        </button>
      ),
    }
  }, [dai])
  const programs = React.useMemo(() => {
    let programs = []
    if (!!dai) {
      programs.push(dsr)
    }

    if (!!eth) {
      programs.push(earn)
    }

    return programs
  }, [dai, eth])

  return (
    <div className="flex items-start gap-4">
      {programs.length > 0
        ? programs.map(program => (
            <Modal
              key={program.icon}
              heading={program.heading}
              trigger={
                <button type="button" className="inline-flex items-center rounded-full p-2 px-4 dark:bg-slate-800">
                  <div className="mr-4 h-8 w-8 overflow-hidden rounded-full" title="Bancor EarnPortal">
                    <img src={program?.icon} />
                  </div>
                  <div className="flex items-center text-xl font-normal">
                    {program?.name} <span className="ml-2 pt-[.1rem] text-xs">{program?.subText}</span>
                  </div>
                </button>
              }
            >
              {program?.modal}
            </Modal>
          ))
        : null}
    </div>
  )
}

export default EarnPortal
