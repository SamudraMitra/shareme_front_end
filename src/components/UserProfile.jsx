import React,{useState,useEffect} from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useParams,useNavigate, Navigate } from 'react-router-dom'
import { googleLogout } from '@react-oauth/google'
import { userCreatedPinsQuery,userQuery,userSavedPinsQuery } from '../utils/data'
import { client } from '../client'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'
const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,technology'
const activeBtnStyles = 'bg-red-500 text-white font-bold rounded-full w-20 outline-none'
const notActiveBtnStyles = 'bg-primary-500 mr-4 text-black font-bold rounded-full w-20 outline-none'
const UserProfile = () => {
  const [user,setUser] = useState(null);
  const [pins,setPins] = useState(null);
  const [text,setText] = useState('Created');
  const [activeBtn,setActiveBtn] = useState('created');
  const navigate = useNavigate();
  const {userId} = useParams();//jiska profile view horha h
  // console.log(user?._id);
  // console.log/(userId);
  useEffect(()=>{
    const query = userQuery(userId)
    client.fetch(query)
    .then((data)=>{
      // console.log(data[0]);
      setUser(data[0]);
    })
  },[userId])
  useEffect(()=>{
    if(text==='Created'){
      const createdPinsQuery = userCreatedPinsQuery(userId)
      client.fetch(createdPinsQuery)
      .then((data)=>{
        setPins(data);
      })
    }
    else{
      const savedPinsQuery = userSavedPinsQuery(userId)
      client.fetch(savedPinsQuery)
      .then((data)=>{
        setPins(data);
      })
    }

  },[text,userId])
  if(!user) {
    return <Spinner message='Loading profile..'/>
  }
  return (
    <div className='relative pb-2 h-full justify-center items-center'>
    <div className='flex flex-col pb-5'>
      <div className='relative flex flex-col mb-7'>
        <div className='flex flex-col justify-center items-center'>
          <img
            src={randomImage}
            className='w-full h-370 2xl:h-510 shadow-lg object-cover'
            alt='banner-pic'
          />
          <img
            className='top-95 rounded-full w-20 h-20 shadow-xl object-cover'
            src={user.image}
            alt='user-pic'
          />
          <h1 className='font-bold text-3xl text-center mt-3'>
            {user.username}
          </h1>
          <div className='absolute top-0 z-1 right-0 p-2'>
            {userId === user._id && (
              <button
              type='button'
              className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
              onClick={(e)=>{
                            e.stopPropagation();
                            googleLogout();
                            localStorage.removeItem('user');
                            navigate('/login');
                        }}>
                <AiOutlineLogout/>
              </button>
            )}
          </div>
        </div>
        <div className='text-center mb-7'>
          <button 
          type='button'
          onClick={(e)=>{
            console.log(e.target.textContent);
            setText(e.target.textContent);
            setActiveBtn('created');
            }}
            className = {`${activeBtn==='created' ? activeBtnStyles:notActiveBtnStyles}`}
            >
              Created
            </button>
            <button 
          type='button'
          onClick={(e)=>{
            setText(e.target.textContent);
            setActiveBtn('saved');
            }}
            className = {`${activeBtn==='saved' ? activeBtnStyles:notActiveBtnStyles}`}
            >
              Saved
            </button>
        </div>
        {pins?.length ? (
        <div className='px-2'>
          <MasonryLayout pins={pins}/>
        </div>):(
          <div className='flex justify-center font-bold items-center w-full text-xl mt-2'>No pins found</div>
        )}
      </div>
    </div>  
    </div>
  )
}

export default UserProfile
