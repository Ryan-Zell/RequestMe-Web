import type { NextPage } from 'next'
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs'
import Layout from 'components/Layout'
import LinksView from 'views/Links'

const Links: NextPage = () => {
  return (
    <Layout>
      <LinksView />
    </Layout>
  )
}

export default Links
export const getServerSideProps = withPageAuth({ redirectTo: '/' })
