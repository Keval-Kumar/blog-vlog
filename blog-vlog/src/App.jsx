/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App;*/

import { Routes, Route, Navigate } from 'react-router'
import Blog from './Blog'
import Vlog from './Vlog'
import Home from './Home'
import AddBlog from './AddBlog'
import BlogDetail from './BlogDetail'
import UpdateBlog from './UpdateBlog'
import AddVlog from './AddVlog'
import VlogDetail from './VlogDetail'
import UpdateVlog from './UpdateVlog'
import About from './About'
import FullBlogPage from './FullBlogPage'
import FullVlogPage from "./FullVlogPage";
export default function App() {
  return (
    <div>
      <Routes>

        <Route path='/' element={<Home/>} />
        <Route path='/Blog/*' element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path='/addBlog' element={<AddBlog />} />
        <Route path="/update/blog/:id" element={<UpdateBlog />} />
        <Route path="/bloglist" element={<FullBlogPage />} />
        <Route path='/Vlog' element={<Vlog />} />
         <Route path="/vlog/:id" element={<VlogDetail />} />
         <Route path='/addVlog' element={<AddVlog />} />
         <Route path="/update/vlog/:id" element={<UpdateVlog />} />
         <Route path="/vloglist" element={<FullVlogPage />} />
          <Route path='/About' element={<About />} />
        <Route path='/*' element={<Navigate to='/' />} />
      </Routes>
    </div>
  )
}