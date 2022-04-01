import { Picker }        from "emoji-mart"
import { motion }          from "framer-motion"
import React, { useState } from "react"
import { MdAddReaction }   from "react-icons/md"

const MobileEmojiPickerButton = ({ theme, pickerVariants, handleEmojiReaction, setIsPickerActive, isPickerActive}) => {

  return (
    <span
      onClick={() => {
        setIsPickerActive(true)
      }}
      className="flex items-center bg-slate-100 sm:bg-slate-200 px-3 py-1 rounded-full mr-1"
    >
      <MdAddReaction size={16} />
      <div>
        <motion.div
          variants={pickerVariants}
          initial="initial"
          animate={isPickerActive ? "animate" : "exit"}
          exit="exit"
          className="absolute bottom-8 right-0 z-99 pointer-events-none"
        >
          <Picker
            theme={theme}
            onSelect={(emoji) => {
              handleEmojiReaction(emoji)
            }}
          />
        </motion.div>
     </div>
    </span>
  )
}

export default MobileEmojiPickerButton
