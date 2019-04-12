import React from 'react'
import ReactDOM from 'react-dom'

import EscrowEvidence from './containers/escrow'


const App = () => (
  <>
    <EscrowEvidence />
  </>
)

const render = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

render(App)

if (module.hot)
  module.hot.accept(App, () => {
    render(App)
  })
