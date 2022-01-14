import React from "react"
import Avatar from "boring-avatars"
import Image from "next/image"
import { useEnsAvatar } from "wagmi"

const UserImage = ({ address }) => {
  const [{ data, error, loading }, getEnsAvatar] = useEnsAvatar({
    addressOrName: address,
  })

  console.log("getEnsAvatar data", data)

  return (
    <div className="flex w-full justify-center md:justify-start">
      {data ? (
        <Image
          //loader={myLoader}
          src={data}
          alt="Picture of the author"
          width={"13rem"}
          height={"13rem"}
        />
      ) : (
        <Avatar
          size={"13rem"}
          name={address}
          variant="pixel"
          colors={["#0DB2AC", "#F5DD7E", "#FC8D4D", "#FC694D", "#FABA32"]}
        />
      )}
    </div>
  )
}

export default UserImage
