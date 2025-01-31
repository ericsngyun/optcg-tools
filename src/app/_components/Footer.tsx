import React from 'react'
import MaxWidthWrapper from './MaxWidthWrapper'

const Footer = () => {
  return (
    <MaxWidthWrapper>
      <div className="flex justify-evenly mt-auto align-middle py-8">
        <h1 className="text-3xl">optcgtools</h1>
        <div className="flex flex-col align-middle">
          developed by eric
        </div>
      </div>
    </MaxWidthWrapper>
  )
}

export default Footer