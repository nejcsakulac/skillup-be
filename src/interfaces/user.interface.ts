export interface UserData {
  id: string
  first_name?: string
  last_name?: string
  email: string
  avatar?: string
  role?: { id: string; name: string }
}