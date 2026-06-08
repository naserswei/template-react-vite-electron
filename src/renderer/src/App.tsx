import Versions from './components/Versions'
import { UsersDemo } from './features/users/UsersDemo'
import { Button } from './components/ui/button'

function App(): React.JSX.Element {
  // Create a client
  return (
    <>
      <Button>Click me</Button>
      <h1 className="text-3xl font-bold underline">Hello World</h1>
      <p>App version: 1.0.1</p>
      <UsersDemo />
      <Versions />
    </>
  )
}

export default App
