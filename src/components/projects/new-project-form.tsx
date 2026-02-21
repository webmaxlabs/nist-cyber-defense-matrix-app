'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { INDUSTRIES } from '@/lib/constants/industries'
import { COMPANY_SIZES } from '@/lib/constants/company-sizes'
import { useCreateProject } from '@/lib/hooks/use-projects'

export function NewProjectForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [industry, setIndustry] = useState('')
  const [companySize, setCompanySize] = useState('')
  const router = useRouter()
  const createMutation = useCreateProject()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const project = await createMutation.mutateAsync({
        name,
        description: description || undefined,
        industry: industry || undefined,
        company_size: companySize || undefined,
      })
      if (project) router.push(`/project/${project.id}`)
    } catch (err) {
      console.error('Project creation failed:', err)
    }
  }

  return (
    <Card className="max-w-xl mx-auto glass border-slate-200 dark:border-white/10">
      <CardHeader>
        <CardTitle className="font-display">Create New Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-600 dark:text-slate-300">Project Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Q1 Security Assessment"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-500/40"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-600 dark:text-slate-300">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this assessment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-500/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-600 dark:text-slate-300">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-foreground">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent className="glass border-slate-200 dark:border-white/10">
                  {INDUSTRIES.map((i) => (
                    <SelectItem key={i.value} value={i.value}>
                      {i.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600 dark:text-slate-300">Company Size</Label>
              <Select value={companySize} onValueChange={setCompanySize}>
                <SelectTrigger className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-foreground">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent className="glass border-slate-200 dark:border-white/10">
                  {COMPANY_SIZES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold"
              disabled={!name || createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
