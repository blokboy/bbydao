import { Emoji, Picker }           from "emoji-mart"
import { AnimatePresence, motion } from "framer-motion"
import React, { useState }         from "react"
import { MdAddReaction }           from "react-icons/md"

const ReactionBar = ({isActive, handleEmojiReaction, theme, pickerVariants, variants}) => {
  const [isPickerActive, setIsPickerActive] = useState(false)

  return (
    <div>
      <AnimatePresence>
        <motion.div
          variants={variants}
          initial="initial"
          animate={isActive ? "animate" : "exit"}
          exit="exit"
          className="flex items-center absolute right-4 bg-slate-300 rounded border border-slate-400"
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
            <MdAddReaction size={16} />
          </span>
          <motion.div
            variants={pickerVariants}
            initial="initial"
            animate={isPickerActive ? "animate" : "exit"}
            exit="exit"
            className="absolute bottom-0 right-14 z-99 pointer-events-none"
          >
            <Picker
              theme={theme}
              onSelect={(emoji) => {
                handleEmojiReaction(emoji)
              }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default ReactionBar
