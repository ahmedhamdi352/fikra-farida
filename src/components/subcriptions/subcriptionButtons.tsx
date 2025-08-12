import React from 'react'
import Lock from 'assets/icons/lock.png'
import Crown from 'assets/icons/crown.png'
import Image from 'next/image'

export function UnlockedButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className='flex gap-2 py-3 px-6 bg-[#FFF4D3] font-semibold text-black rounded-xl'>
      subscribe to unlock
      <Image src={Lock} alt="lock" />
    </button>
  )
}

export function UpgradButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className='flex gap-2 py-3 px-6 bg-[#FFF4D3] font-semibold text-black rounded-xl'>
      Upgrade Now
      <Image src={Crown} alt="lock" />
    </button>
  )
}

export function ProButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className='flex gap-2 py-3 px-6 bg-[#FFF4D3] font-semibold text-black rounded-xl'>
      Pro
      <Image src={Crown} alt="lock" />
    </button>
  )
}

