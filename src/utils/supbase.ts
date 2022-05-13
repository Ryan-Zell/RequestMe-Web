const handleSupabaseError = ({ error, ...rest }: any) => {
  if (error) {
    throw error
  }
  return rest
}

export { handleSupabaseError }
