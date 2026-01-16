import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardProps {
  user: any
  onLogout: () => void
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-2xl mx-auto bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-4">
            {user.picture ? (
              <img src={user.picture} alt="Profile" className="w-16 h-16 rounded-full border border-gray-200" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-white text-lg font-medium">
                {user.name?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Welcome, {user.name}</CardTitle>
              <p className="text-gray-600 text-sm mt-1">{user.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-end">
            <Button 
              onClick={onLogout} 
              variant="outline" 
              className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}