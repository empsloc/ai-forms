import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import Themes from '@/app/_data/Themes'
import GradientBg from '@/app/_data/GradientBg'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
  
function Controller({selectedTheme, selectedBackground, setSignInEnable}:any) {
    const [showMore, setShowMore] = useState<any>(6)
  return (
    <div>
        <h2 className='my-1'>
           Theme
        </h2>
        <Select onValueChange={(value:any)=>selectedTheme(value)}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    {Themes.map((theme,index)=>(
        <SelectItem value={theme.theme} key={index}>
            <div className='flex gap-2'>
            <div className='flex'>
                <div className='h-5 w-5 rounded-l-lg' style={{backgroundColor:theme.primary}}>

                </div>
                <div className='h-5 w-5' style={{backgroundColor:theme.secondary}}>

                </div>
                <div className='h-5 w-5' style={{backgroundColor:theme.accent}}>

                </div>
                <div className='h-5 w-5 rounded-r-md' style={{backgroundColor:theme.neutral}}>

                </div>
                
            </div>
            {theme.theme}
            </div>
        </SelectItem>
    ))}
  </SelectContent>
</Select>

<h2 className='mt-8 my-1'>
    Background
</h2>
<div className='grid grid-cols-3 gap-4'>
    {GradientBg.map((bg:any,index:any)=>(index<showMore)&&(
        <div key={index} onClick={()=>selectedBackground(bg.gradient)} className="text-xs flex justify-center items-center w-full h-[50px] cursor-pointer rounded-lg hover:border-black hover:border-2" style={{background:bg.gradient}}>
            {index==0&&"None"}
            </div>

    ))}
</div>
<Button variant="ghost" className='w-full my-1' size="sm" onClick={()=>setShowMore(showMore>6?6:10)}>{showMore>6?"Show less":"Show more"}</Button>

<div className='flex gap-2 my-4 items-center mt-10'>

<Checkbox onCheckedChange={(e)=>setSignInEnable(e)}/> <h2>
  Enable Social Authentication before submitting the form
</h2>
</div>
    </div>
  )
}

export default Controller