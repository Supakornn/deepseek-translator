import './app.css'
import Popup from './popup.svelte'

const app = new Popup({
  target: document.getElementById('app')!
})

export default app
