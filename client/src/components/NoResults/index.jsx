export function NoResults({ existingData, noDataMessage }) {
  return (
    <div className='w-full mt-4'>
      <h3 className='text-center font-semibold text-lg'>
        {existingData ?
          'No results'
          :
          noDataMessage
        }
      </h3>
    </div>
  )
}