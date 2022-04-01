import { Emoji } from "emoji-mart"
import React     from "react"

const EmojiButton = ({handleEmojiReaction, item}) => {
  return (
    <div
      className="flex items-center bg-slate-900 dark:bg-slate-700 px-3 py-1 rounded-full mr-1 hover:cursor-pointer"
      onClick={() => handleEmojiReaction({ id: item.id, skin: item.skin })}
    >
      <Emoji
        emoji={{
          id: item?.id,
          skin: item?.skin
        }}
        size={16}
      />
      <div className="pl-1 text-white text-xs font-light">
        {item.count}
      </div>
    </div>
  )
}

export default EmojiButton
