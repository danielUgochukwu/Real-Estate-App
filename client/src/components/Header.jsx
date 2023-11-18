import { Navbar } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { useSelector } from 'react-redux'

const Header = () => {
  const { currentUser } = useSelector((state) => state.user)
  return (
    <Navbar fluid rounded className='bg-slate-200 shadow-md'> 
      <Navbar.Brand as={Link} to='/' >
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
          <span className='text-slate-500'>Ezy</span>
          <span className='text-slate-700'>Homz</span>
        </h1>
      </Navbar.Brand>
      <form className='bg-slate-100 rounded-lg flex items-center'>
        <input type="text" placeholder='Search...'            className='bg-transparent border-none focus:outline-none w-24 sm:w-64  '
        />
        <FaSearch className='text-slate-500 mr-3'/>
      </form>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link as={Link} to='/' active>Home</Navbar.Link>
        <Navbar.Link as={Link} to='/about'>About</Navbar.Link>
        <Navbar.Link as={Link} to='/profile'>
          {currentUser ? (
            <img className='rounded-full w-7 h-7 object-cover' src={currentUser.avatar} alt="profile" />
          ): (
            `Sign In`
          )}
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>

  )
}

export default Header