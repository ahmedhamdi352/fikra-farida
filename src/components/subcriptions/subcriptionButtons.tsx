import React, { useState } from 'react'
import Lock from 'assets/icons/lock.png'
import Crown from 'assets/icons/crown.png'
import Image from 'next/image'
import SubscriptionsPopup from './subcriptionsPopup'

export function UnlockedButton() {
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setShowSubscriptionPopup(true)} className='flex gap-2 py-3 px-6 bg-[#FFF4D3] font-semibold text-black rounded-xl'>
        subscribe to unlock
        <Image src={Lock} alt="lock" />
      </button>
      {showSubscriptionPopup && <SubscriptionsPopup
        isOpen={showSubscriptionPopup}
        onClose={() => setShowSubscriptionPopup(false)}
      />}
    </>
  )
}

export function TryNow() {
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setShowSubscriptionPopup(true)} className='flex justify-center items-center gap-2 py-3 px-4 bg-[var(--main-color1)] font-semibold text-black rounded-2xl text-center'>
        Try Now
      </button>
      {showSubscriptionPopup && <SubscriptionsPopup
        isOpen={showSubscriptionPopup}
        onClose={() => setShowSubscriptionPopup(false)}
      />}
    </>
  )
}

export function UpgradButton() {
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setShowSubscriptionPopup(true)} className='flex gap-2 py-3 px-6 bg-[#FFF4D3] font-semibold text-black rounded-xl'>
        Upgrade Now
        <Image src={Crown} alt="lock" />
      </button>
      {showSubscriptionPopup && <SubscriptionsPopup
        isOpen={showSubscriptionPopup}
        onClose={() => setShowSubscriptionPopup(false)}
      />}
    </>
  )
}

export function ProButton() {
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setShowSubscriptionPopup(true)} className='flex gap-2 py-3 px-6 bg-[#FFF4D3] font-semibold text-black rounded-xl'>
        Pro
        <Image src={Crown} alt="lock" />
      </button>
      {showSubscriptionPopup && <SubscriptionsPopup
        isOpen={showSubscriptionPopup}
        onClose={() => setShowSubscriptionPopup(false)}
      />}
    </>
  )
}

