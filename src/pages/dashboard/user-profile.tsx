import type { NextPage } from 'next'
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs'
import Layout from 'components/Layout'
import UserProfile from 'views/UserProfile'

const UserProfilePage: NextPage = () => {
  return (
    <Layout>
      <UserProfile />
    </Layout>
  )
}
export const getServerSideProps = withPageAuth({ redirectTo: '/' })

export default UserProfilePage
