import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { useTRPC } from '../../trpc'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const trpc = useTRPC()
  const navigate = useNavigate()

  const registerMutation = useMutation(
    trpc.auth.register.mutationOptions({
      onSuccess: () => {
        navigate('/login')
      },
    }),
  )

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    registerMutation.mutate({
      name,
      email,
      password,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>

            <Input
              id="name"
              placeholder="Please enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              placeholder="Please enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              type="password"
              placeholder="Please enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? 'Registering...'
              : 'Register'}
          </Button>

          {registerMutation.isError && (
            <p className="text-sm text-red-500">
              {registerMutation.error.message}
            </p>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/login')}
          >
            Already have an account? Login
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
