import { AddressElement } from '@stripe/react-stripe-js'
import React from 'react'

const AddressForm = () => {
  return (
    <form>
        <h3>Address</h3>
        <AddressElement options={{mode:"shipping"}} onChange={(event)=>{
            if(event.complete){
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const address=event.value.address;
            }
        }}/>
    </form>
  )
}

export default AddressForm
