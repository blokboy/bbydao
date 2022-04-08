import { Emoji, Picker }           from "emoji-mart"
import React                       from "react"
import { MdAddReaction }           from "react-icons/md"

const ReactionBar = ({
                       isActive,
                       handleEmojiReaction,
                       theme,
                       setIsPickerActive,
                       isPickerActive
                     }) => {

  return (
    <div>
        <div
          className={`${isActive ? `flex` : `hidden`} items-center absolute px-2 top-2 right-2 bg-slate-300 dark:bg-slate-700 rounded-full border border-slate-400 dark:border-slate-800`}
        >
          <span className="flex p-1">
            <Emoji
              emoji={{ id: "heart", skin: 3 }}
              size={16}
              onClick={(emoji, event) => {
                handleEmojiReaction(emoji)
              }}
            />
          </span>
          <span
            onClick={() => {
              setIsPickerActive(true)

            }}
            className="flex p-1 cursor-pointer"
          >
            <MdAddReaction
              size={16}
            />
          </span>

          <div className={`absolute top-0 right-14 z-50 ${isPickerActive ? `block` : `hidden`}`}>
            <Picker
              theme={theme}
              showSkinTones={true}
              title={''}
              onSelect={(emoji) => {
                handleEmojiReaction(emoji)
                setIsPickerActive(false)
              }}
            />
          </div>
        </div>
    </div>
  )
}

export default ReactionBar
