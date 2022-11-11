import React, { useRef, useState, useCallback , useEffect} from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage , faXmark, faDownload} from '@fortawesome/free-solid-svg-icons';

function App() {

  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({aspect: 9/16});
  const [completedCrop, setCompletedCrop] = useState(null);

  const imageRef = useRef();
  const imageLoadRef = useRef();
  const canvasRef = useRef();

  const handleImage = (e) =>{
    const { files } = e.target;

    if( files && files.length > 0 ){

      const reader = new FileReader();
      reader.readAsDataURL(files[0])
      reader.addEventListener("load", ()=>{
        setImage(reader.result);
      })
    }
    // console.log(files);
  };
  const handleLoad = useCallback((img)=>{
    imageLoadRef.current = img
  },[])

  const clear = () =>{

    setImage(null);
    setCompletedCrop(null);
    setCrop({aspect: 9/16 });
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvasRef.current = null;
    window.location.reload();

  };

  useEffect (()=>{
    if(!completedCrop || !imageLoadRef){
      return;
    }

    const rc_image = imageLoadRef.current;
    const canvas = canvasRef.current;

    const crop = completedCrop;

    const scaleX = rc_image.target.naturalWidth / rc_image.target.width;
    const scaleY = rc_image.target.naturalHeight / rc_image.target.height;

    const pixelRatio = window.devicePixelRatio;
    const dImageWidth = crop.width * scaleX;
    const dImageHeight = crop.height * scaleY;
    

    canvas.width = dImageWidth * pixelRatio;
    canvas.height = dImageHeight * pixelRatio;

    const ctx = canvas.getContext("2d")
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "large";
    ctx.imageSmoothingEnabled = true;

    ctx.drawImage(
      rc_image.target, 
      crop.x * scaleX, 
      crop.y * scaleY, 
      dImageWidth, 
      dImageHeight, 
      0, 
      0, 
      dImageWidth, 
      dImageHeight 
    );

  },[completedCrop]);

  const downloadImage = () =>{
    if(!completedCrop || !canvasRef.current){
      return;
    }

    canvasRef.current.toBlob((blob)=>{

      const previewUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.download = "rasedProvideYou.png";
      anchor.href = URL.createObjectURL(blob);
      anchor.click();
      window.URL.revokeObjectURL(previewUrl);

    },"image/png", 1);
  }

  return (
    <div className="">
        <div className=''>
            <div className='flex items-center justify-center divide-x-4'>
              <button className='px-5 py-2 bg-lime-400 text-white' onClick={()=> imageRef.current.click()}><FontAwesomeIcon icon={faImage} size="lg" className='' /></button>
              <button className='px-5 py-2 bg-red-800 text-white' onClick={clear}><FontAwesomeIcon icon={faXmark} size="lg" className='' /></button>
              <button className='px-5 py-2 bg-green-700 text-white' disabled={!completedCrop?.width || !completedCrop?.height} onClick={downloadImage}><FontAwesomeIcon icon={faDownload} size="lg" className=''/></button>
            </div>
            <div>
              <input type="file"  accept='image/*' ref={imageRef} className="hidden" onChange={handleImage} />
            </div>
            <div className='flex items-center justify-center mt-12'>
              <div className='flex items-center justify-center mr-4'>
                <canvas ref={canvasRef}></canvas>
              </div>
              <div className='flex items-center justify-center'>
                {
                  image && (<ReactCrop crop={crop} onChange={(c)=> setCrop(c)} onComplete={(c)=> setCompletedCrop(c)}  ><img src={image} onLoad={handleLoad} alt="" /></ReactCrop>)
                }
              </div>
            </div>
        </div>
    </div>
  );
}

export default App;
