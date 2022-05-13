import type { NextPage } from 'next'
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs'
import Layout from 'components/Layout'
import DashboardView from 'views/Dashboard'

const Dashboard: NextPage = () => {
  return (
    <Layout>
      <DashboardView />
    </Layout>
  )
}

export default Dashboard
export const getServerSideProps = withPageAuth({ redirectTo: '/' })
