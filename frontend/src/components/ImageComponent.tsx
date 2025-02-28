import React from 'react'
import { useMessageStore } from '../store/useMessageStore'

const ImageComponent = ({src, index}:{src:string, index:number}) => {
  const {selectedImages, setSelectedImages, clearSelectedImages} = useMessageStore()
  const deleteImage = () => {
    const filteredImages = selectedImages.filter((_:string,i:number)=>i!=index)
    clearSelectedImages()
    setSelectedImages(filteredImages)
  }
  return (
    <div className='w-[80px] h-[70px] relative bg-blue-200 rounded-md'>
        <div onClick={deleteImage} className='bg-white cursor-pointer text-black absolute w-[18px] h-[18px] rounded-full flex justify-center items-center -right-2 -top-2 text-sm'>x</div>
        <img src={src} className='object-cover w-full h-full rounded-md'/>
    </div>
  )
}

export default ImageComponent