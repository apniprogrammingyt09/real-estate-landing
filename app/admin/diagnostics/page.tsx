"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Database, RefreshCw, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initializingDb, setInitializingDb] = useState(false)

  const fetchDiagnostics = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/diagnostics")
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      setDiagnostics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const initializeDatabase = async () => {
    setInitializingDb(true)
    try {
      const response = await fetch("/api/admin/init-db")
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      alert(data.message || "Database initialized successfully!")
      fetchDiagnostics()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      alert("Failed to initialize database. See console for details.")
    } finally {
      setInitializingDb(false)
    }
  }

  useEffect(() => {
    fetchDiagnostics()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/admin" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Database Diagnostics</h1>
        </div>

        <div className="flex justify-between mb-4">
          <Button onClick={fetchDiagnostics} disabled={loading} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={initializeDatabase}
            disabled={initializingDb}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            {initializingDb ? "Initializing..." : "Initialize Database"}
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-300 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-red-700 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {loading && !error ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading diagnostics...</p>
          </div>
        ) : diagnostics ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  MongoDB Connection
                </CardTitle>
                <CardDescription>Database: {diagnostics.mongodb?.database || "Not specified"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className={`h-3 w-3 rounded-full ${diagnostics.mongodb?.connected ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span>{diagnostics.mongodb?.connected ? "Connected" : "Disconnected"}</span>
                </div>

                <h3 className="font-medium mb-2">Collections:</h3>
                <div className="space-y-2">
                  {diagnostics.mongodb?.collections?.map((collection: any) => (
                    <div key={collection.name} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                      <span>{collection.name}</span>
                      <span className="font-mono">{collection.count} documents</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sample Data</CardTitle>
                <CardDescription>Preview of data in the database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Properties:</h3>
                    {diagnostics.sampleData?.properties?.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {diagnostics.sampleData.properties.map((property: any) => (
                              <tr key={property.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {property.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${
                                      property.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : property.status === "pending"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {property.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500">No properties found</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Agents:</h3>
                    {diagnostics.sampleData?.agents?.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {diagnostics.sampleData.agents.map((agent: any) => (
                              <tr key={agent.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {agent.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.name}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500">No agents found</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500">
                  This is a preview of the data. Visit the admin pages to see all records.
                </p>
              </CardFooter>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  )
}
