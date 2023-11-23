/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

const Profile = () => {
  const filePicker = useRef(null)
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const [ file, setFile ] = useState(undefined)  
  const [ filePercent, setFilePercent ] = useState(0)
  const [ fileUploadError, setFileUploadError ] = useState(false)  
  const [formData, setFormData] = useState({})
  const [ updateSuccess, setUpdateSuccess ] = useState(false)
  const dispatch = useDispatch()
  console.log(formData);

  
  // firebase storage
 /* allow read;
  allow write: if
  request.resource.size < 2 * 1024 * 1024 &&
  request.resource.contentType.matches('image/.*')
  */
  
  useEffect(() => {
    if(file) {
      handleFileUpload(file)
    }
  } , [file])
 
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName); 
    const uploadTask = uploadBytesResumable(storageRef, file); 
    
    uploadTask.on('state_changed', (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      setFilePercent(progress)
    },
    (error) => {
      setFileUploadError(true)
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => setFormData({...formData, avatar: downloadURL}))
    }
    );  
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,[e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      setUpdateSuccess(true)
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input 
           onChange={(e) => setFile(e.target.files[0])} 
           type="file" 
           ref={filePicker} 
           hidden accept='image/*'
          />
        <img onClick={() => filePicker.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className='rounded-full w-24 h-24 object-cover cursor-pointer mt-2 self-center' />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>{`Upload Failed (Image must be less than 2mb)`}</span>
          ) : filePercent > 0 && filePercent < 100 ? (
            <span className='text-slate-700 '>{`Uploading: ${filePercent}%`}</span>
          ) : filePercent === 100 ? (
            <span className='text-green-700'>{`Upload Success`}</span>
          ) : (
            ''
          )}
        </p>
        <input 
           type="text" 
           placeholder='username' 
           id='username' 
           className='border p-3 rounded-lg' 
           defaultValue={currentUser.username} 
           onChange={handleChange}
        />
        <input 
           type="email" 
           placeholder='email' 
           id='email' 
           className='border p-3 rounded-lg' 
           defaultValue={currentUser.email} 
           onChange={handleChange}
        />
        <input 
           type="password" 
           placeholder='password' 
           id='pass' 
           className='border p-3 rounded-lg' 
           onChange={handleChange}
        />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Updating...' : 'Update'}</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-500 cursor-pointer'>Delete Account</span>
        <span className='text-red-500 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'Update Success' : ''} </p>
    </div>
  )
}

export default Profile;