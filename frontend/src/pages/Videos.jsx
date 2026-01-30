import VideoPage from '../components/VideoPage'
import VideoSideBar from '../components/VideoSideBar'

const Videos = () => {
  return (
    <div className='flex flex-row justify-between items-start'>
      <VideoPage/>
      <VideoSideBar/>
    </div>
  )
}

export default Videos
