import Achievements from '~/components/Achievements'
import ProfileSection from '~/components/ProfileSection'
import EditProfile from '~/components/EditProfile'

export default function ProfilePage() {
  return (
    <div className='grid grid-cols-5 w-fit m-8'>

      <div className='col-span-2'>
      <ProfileSection/>
      </div>
      <div className='col-span-3 min-w-fit'>
        <EditProfile />
      </div>
      {/* <div className='col-span-2 min-w-fit' style={{minWidth:'500px'}}>
        <Achievements expanded={true} />
      </div> */}
    </div>
  )
}

