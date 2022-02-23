import { Signer } from 'ethers'
import { paths } from 'interfaces/apiTypes'
import executeSteps, { Execute } from 'lib/executeSteps'
import setParams from 'lib/params'

type Data = {
  query: paths['/execute/bid']['get']['parameters']['query']
  signer: Signer | undefined
  apiBase: string | undefined
  setSteps: React.Dispatch<React.SetStateAction<Execute['steps']>>
  handleUserRejection?: () => any
  handleError?: (err: any) => any
  handleSuccess?: () => any
}

export default async function placeBid(data: Data) {
  const {
    query,
    signer,
    apiBase,
    setSteps,
    handleUserRejection,
    handleSuccess,
    handleError,
  } = data

  if (!signer || !apiBase) {
    console.debug(data)
    throw new ReferenceError('Some data is missing')
  }

  try {
    const url = new URL('/execute/bid', apiBase)

    setParams(url, query)

    await executeSteps(url, signer, setSteps)

    if (handleSuccess) handleSuccess()
  } catch (err: any) {
    // Handle user rejection
    if (err?.code === 4001) {
      // close modal
      if (handleUserRejection) handleUserRejection()
    }
    if (handleError) handleError(err)
    console.error(err)
  }
}