import { Picker }        from "emoji-mart"
import React             from "react"
import { MdAddReaction } from "react-icons/md"

const MobileEmojiPickerButton = ({ theme, handleEmojiReaction, setIsPickerActive, isPickerActive }) => {

  return (
    <span
      onClick={() => {
        setIsPickerActive(true)
      }}
      className="flex items-center bg-slate-300 dark:bg-slate-700 sm:bg-slate-200 px-3 py-1 rounded-full mr-1"
    >
      <MdAddReaction size={16} />
      <div>
        <div
          className={`${isPickerActive ? `block` : `hidden`} absolute top-24 right-0 z-10`}
        >
          <Picker
            showSkinTones={true}
            title={""}
            theme={theme}
            onSelect={(emoji) => {
              handleEmojiReaction(emoji)
            }}
          />
        </div>
     </div>
    </span>
  )
}

export default MobileEmojiPickerButton
