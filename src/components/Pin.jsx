import React,{useState} from 'react'
import {Link, Navigate, useNavigate} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid';
import {MdDownloadForOffline} from 'react-icons/md';
import {BsFillArrowUpRightCircleFill} from 'react-icons/bs';
import {FiArrowUpRight} from 'react-icons/ai';
import { client,urlFor } from '../client'
import { fetchUser } from '../utils/fetchUser';
import { RiWindowFill } from 'react-icons/ri';
import { AiTwotoneDelete } from 'react-icons/ai';
import { userQuery } from '../utils/data';
const Pin = ({pin: {postedBy, image, _id, destination,save,userId}}) => {
        // console.log(save);
        
    const [postHovered,setPostHovered] = useState(false);
    const [savingPost,setSavingPost] = useState(false);
    const navigate = useNavigate();
    const user = fetchUser();
    const alreadySaved=!!(save?.filter((item)=>item.postedBy._id===user.sub))?.length;
    const savePin=(id)=>{
        if(!alreadySaved)
        {
            setSavingPost(true);
            client
            .patch(id)
            .setIfMissing({save:[]})
            .insert('after','save[-1]',[{
                _key: uuidv4(),
                userId: user.sub,
                postedBy:{
                    _type: 'postedBy',
                    _ref: user.sub
                }
            }])
            .commit()
            .then(()=>{
                window.location.reload();
                setSavingPost(false);
            })
        }
    }
    const deletePin = (id)=>{
        client.delete(id)
        .then(()=>{
            window.location.reload();
        })
    }
    const [pincreater,setpincreater] = useState('');
    const query = userQuery(postedBy?._id);
    client.fetch(query)
    .then((data)=>{
    setpincreater(data[0].username || data[0].userName);
    })
  return (<div className='m-2 '>
        <div
            onMouseEnter={()=>setPostHovered(true)}
            onMouseLeave={()=>setPostHovered(false)}
            onClick={()=>navigate(`/pin-detail/${_id}`)}
            className = 'relative cursor-zoom-in w-auto hover:shadow-lg overflow-hidden transition-all duration-500 ease-in-out'
        >
        <img className='rounded-lg w-full' alt='user-post' src = {urlFor(image).width(250).url()}/>
        {
            postHovered && (
                <div 
                className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'
                style={{height:'100%'}}
                >
                <div className='flex items-center justify-between'>
                    <div className='flex gap-2'>
                        <a 
                        href={`${image?.asset?.url}?dl=`} 
                        download
                        onClick={(e)=> e.stopPropagation()}
                        className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                        >
                        <MdDownloadForOffline/>
                        </a>
                    </div>
                    {alreadySaved?(
                        <button type='button' className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-xl hover:shadow-md outline-none'>
                        {save?.length} Saved
                        </button>
                    ):(
                        <button type='button' 
                        onClick={(e)=>{
                            e.stopPropagation();
                            savePin(_id);
                        }}
                        className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-xl hover:shadow-md outline-none'>
                            {savingPost?'saving':'save'}
                        </button>
                    )
                    }
                </div>
                <div className='flex justify-between items-center gap-2 w-full'>
                    {destination && (
                        <a 
                        href={destination}
                        target='_blank'
                        rel='noreferrer'
                        className='bg-white text-sm flex items-center gap-2 text-black font-bold p-2 pl-4 pr-5 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
                        >
                            <BsFillArrowUpRightCircleFill/> 
                            {/* {destination.length>20?destination.slice(8,20):destination.slice(8)} */}
                        </a>
                    )}
                    {
                        postedBy?._id === user.sub && (
                            <button
                            type='button'
                            onClick={(e)=>{
                            e.stopPropagation();
                            deletePin(_id);
                            }}
                            className='bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold px-5 py-1 text-base rounded-xl hover:shadow-md outline-none'
                            >
                            <AiTwotoneDelete/>
                            </button>
                        )
                    }
                </div>
                </div>
            )
        }
        </div>
        <Link
        to={`../user-profile/${postedBy?._id}`}
        className='flex gap-2 mt-2 items-center'
        >
        <img
        referrerPolicy='no-referrer'
            className='w-8 h-8 rounded-full object-cover'
            src={postedBy.image}
            alt='user-profile'
        />
        <p className='font-semibold capitalize'>{pincreater}</p>
        </Link>
    </div>
  )
}

export default Pin